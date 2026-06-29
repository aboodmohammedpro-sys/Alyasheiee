<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\GoodsReceivedNote;
use App\Modules\Warehouse\Models\GrnItem;
use App\Modules\Warehouse\Models\InventoryStock;
use App\Modules\Procurement\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class InventoryService
{
    /**
     * استلام مواد بناءً على أمر شراء (GRN)
     */
    public function receiveMaterials(PurchaseOrder $po, string $warehouseId, array $receivedItems): GoodsReceivedNote
    {
        return DB::transaction(function () use ($po, $warehouseId, $receivedItems) {
            // 1. إنشاء رأس إشعار الاستلام
            $grn = GoodsReceivedNote::create([
                'grn_number' => 'GRN-' . strtoupper(Str::random(8)),
                'purchase_order_id' => $po->id,
                'warehouse_id' => $warehouseId,
                'received_by' => Auth::id(),
                'received_date' => now(),
            ]);

            foreach ($receivedItems as $itemData) {
                // $itemData: ['material_id' => ..., 'quantity_received' => ...]
                
                // البحث عن الكمية المطلوبة في أمر الشراء
                $poItem = $po->items()->where('material_id', $itemData['material_id'])->first();
                $qtyOrdered = $poItem ? $poItem->quantity : 0;

                // 2. إنشاء بند الاستلام
                GrnItem::create([
                    'goods_received_note_id' => $grn->id,
                    'material_id' => $itemData['material_id'],
                    'quantity_ordered' => $qtyOrdered,
                    'quantity_received' => $itemData['quantity_received']
                ]);

                // 3. تحديث الأرصدة في المستودع
                $this->updateStock($warehouseId, $itemData['material_id'], $itemData['quantity_received']);
            }

            // تحديث حالة أمر الشراء (اختياري: يمكن إضافة تحقق إذا تم استلام كل شيء لإغلاقه)
            $po->update(['status' => 'completed']);

            return $grn->load('items.material');
        });
    }

    /**
     * تحديث رصيد مادة في مستودع معين (زيادة أو نقصان)
     */
    public function updateStock(string $warehouseId, string $materialId, float $quantityDelta)
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
}
