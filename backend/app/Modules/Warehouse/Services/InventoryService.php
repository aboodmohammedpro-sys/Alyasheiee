<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\GoodsReceivedNote;
use App\Modules\Warehouse\Models\GrnItem;
use App\Modules\Warehouse\Models\InventoryStock;
use App\Modules\Warehouse\Models\InventoryTransfer;
use App\Modules\Warehouse\Models\InventoryTransferItem;
use App\Modules\Warehouse\Models\StockMovement;
use App\Modules\Procurement\Models\PurchaseOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryService
{
    /**
     * استلام مواد بناءً على أمر شراء (GRN)
     * يسجّل حركة 'receipt' في دفتر الأستاذ لكل صنف
     */
    public function receiveMaterials(PurchaseOrder $po, string $warehouseId, array $receivedItems): GoodsReceivedNote
    {
        return DB::transaction(function () use ($po, $warehouseId, $receivedItems) {
            $grn = GoodsReceivedNote::create([
                'grn_number'        => 'GRN-' . strtoupper(Str::random(8)),
                'purchase_order_id' => $po->id,
                'warehouse_id'      => $warehouseId,
                'received_by'       => Auth::id(),
                'received_date'     => now(),
            ]);

            foreach ($receivedItems as $itemData) {
                $poItem = $po->items()->where('material_id', $itemData['material_id'])->first();

                GrnItem::create([
                    'goods_received_note_id' => $grn->id,
                    'material_id'            => $itemData['material_id'],
                    'quantity_ordered'        => $poItem ? $poItem->quantity : 0,
                    'quantity_received'       => $itemData['quantity_received'],
                ]);

                // تحديث الرصيد الفوري
                $this->updateStock($warehouseId, $itemData['material_id'], $itemData['quantity_received']);

                // تسجيل حركة في دفتر الأستاذ
                $this->logMovement(
                    warehouseId:   $warehouseId,
                    materialId:    $itemData['material_id'],
                    type:          'receipt',
                    quantity:      +$itemData['quantity_received'],
                    referenceType: GoodsReceivedNote::class,
                    referenceId:   $grn->id,
                    referenceNo:   $grn->grn_number,
                    notes:         "Received via PO #{$po->po_number}",
                );
            }

            $po->update(['status' => 'completed']);

            return $grn->load('items.material');
        });
    }

    /**
     * إنشاء طلب تحويل مواد بين مستودعين
     */
    public function createTransfer(array $data): InventoryTransfer
    {
        return DB::transaction(function () use ($data) {
            $transfer = InventoryTransfer::create([
                'transfer_number'     => 'TRF-' . strtoupper(Str::random(8)),
                'source_warehouse_id' => $data['source_warehouse_id'],
                'target_warehouse_id' => $data['target_warehouse_id'],
                'notes'               => $data['notes'] ?? null,
                'status'              => 'pending',
                'requested_by'        => Auth::id(),
            ]);

            foreach ($data['items'] as $item) {
                InventoryTransferItem::create([
                    'transfer_id'        => $transfer->id,
                    'material_id'        => $item['material_id'],
                    'quantity_requested' => $item['quantity'],
                    'quantity_shipped'   => 0,
                    'quantity_received'  => 0,
                ]);
            }

            return $transfer->load('items.material', 'sourceWarehouse', 'targetWarehouse');
        });
    }

    /**
     * شحن التحويل: خصم البضاعة من المستودع المصدر
     * الحالة تنتقل: pending -> shipped
     */
    public function shipTransfer(InventoryTransfer $transfer): InventoryTransfer
    {
        if ($transfer->status !== 'pending') {
            throw new \Exception("Only pending transfers can be shipped.");
        }

        return DB::transaction(function () use ($transfer) {
            foreach ($transfer->items as $item) {
                // التحقق من وجود رصيد كافٍ
                $currentStock = $this->getStock($transfer->source_warehouse_id, $item->material_id);
                if ($currentStock < $item->quantity_requested) {
                    $materialName = $item->material->name ?? $item->material_id;
                    throw new \Exception(
                        "Insufficient stock for '{$materialName}'. Available: {$currentStock}, Requested: {$item->quantity_requested}"
                    );
                }

                // خصم من المصدر
                $this->updateStock($transfer->source_warehouse_id, $item->material_id, -$item->quantity_requested);
                $item->update(['quantity_shipped' => $item->quantity_requested]);

                // دفتر الأستاذ: خروج من المصدر
                $this->logMovement(
                    warehouseId:   $transfer->source_warehouse_id,
                    materialId:    $item->material_id,
                    type:          'transfer_out',
                    quantity:      -$item->quantity_requested,
                    referenceType: InventoryTransfer::class,
                    referenceId:   $transfer->id,
                    referenceNo:   $transfer->transfer_number,
                    notes:         "Shipped to warehouse ID: {$transfer->target_warehouse_id}",
                );
            }

            $transfer->update([
                'status'      => 'shipped',
                'shipped_by'  => Auth::id(),
                'shipped_at'  => now(),
            ]);

            return $transfer->fresh('items');
        });
    }

    /**
     * استلام التحويل: إضافة البضاعة للمستودع الوجهة
     * الحالة تنتقل: shipped -> completed
     */
    public function receiveTransfer(InventoryTransfer $transfer, array $receivedQuantities = []): InventoryTransfer
    {
        if ($transfer->status !== 'shipped') {
            throw new \Exception("Only shipped transfers can be received.");
        }

        return DB::transaction(function () use ($transfer, $receivedQuantities) {
            foreach ($transfer->items as $item) {
                // الكمية المستلمة فعلياً (قد تكون أقل من المشحونة)
                $qtyReceived = $receivedQuantities[$item->material_id] ?? $item->quantity_shipped;

                $this->updateStock($transfer->target_warehouse_id, $item->material_id, $qtyReceived);
                $item->update(['quantity_received' => $qtyReceived]);

                // دفتر الأستاذ: دخول للوجهة
                $this->logMovement(
                    warehouseId:   $transfer->target_warehouse_id,
                    materialId:    $item->material_id,
                    type:          'transfer_in',
                    quantity:      +$qtyReceived,
                    referenceType: InventoryTransfer::class,
                    referenceId:   $transfer->id,
                    referenceNo:   $transfer->transfer_number,
                    notes:         "Received from warehouse ID: {$transfer->source_warehouse_id}",
                );
            }

            $transfer->update([
                'status'      => 'completed',
                'received_by' => Auth::id(),
                'received_at' => now(),
            ]);

            return $transfer->fresh('items');
        });
    }

    /**
     * تحديث رصيد مادة في مستودع (زيادة أو نقصان مباشر)
     * يُستخدم داخلياً فقط - التسجيل في دفتر الأستاذ يتم من الدوال الأعلى
     */
    public function updateStock(string $warehouseId, string $materialId, float $quantityDelta): InventoryStock
    {
        $stock = InventoryStock::firstOrCreate(
            ['warehouse_id' => $warehouseId, 'material_id' => $materialId],
            ['quantity' => 0]
        );
        $stock->increment('quantity', $quantityDelta);
        return $stock;
    }

    /**
     * الحصول على الرصيد الحالي لمادة في مستودع
     */
    public function getStock(string $warehouseId, string $materialId): float
    {
        return InventoryStock::where('warehouse_id', $warehouseId)
            ->where('material_id', $materialId)
            ->value('quantity') ?? 0;
    }

    /**
     * تسجيل حركة في دفتر الأستاذ
     */
    public function logMovement(
        string $warehouseId,
        string $materialId,
        string $type,
        float  $quantity,
        ?string $referenceType = null,
        ?string $referenceId   = null,
        ?string $referenceNo   = null,
        ?string $notes         = null,
    ): StockMovement {
        return StockMovement::create([
            'warehouse_id'   => $warehouseId,
            'material_id'    => $materialId,
            'type'           => $type,
            'quantity'       => $quantity,
            'reference_type' => $referenceType,
            'reference_id'   => $referenceId,
            'reference_no'   => $referenceNo,
            'notes'          => $notes,
            'performed_by'   => Auth::id(),
        ]);
    }

    /**
     * جلب تاريخ حركات مادة في مستودع
     */
    public function getMovements(string $warehouseId, string $materialId): \Illuminate\Database\Eloquent\Collection
    {
        return StockMovement::where('warehouse_id', $warehouseId)
            ->where('material_id', $materialId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
