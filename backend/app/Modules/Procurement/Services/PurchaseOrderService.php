<?php

namespace App\Modules\Procurement\Services;

use App\Modules\Procurement\Models\PurchaseRequest;
use App\Modules\Procurement\Models\PurchaseOrder;
use App\Modules\Procurement\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PurchaseOrderService
{
    /**
     * تحويل طلب شراء إلى أمر شراء
     */
    public function convertRequestToOrder(PurchaseRequest $request, string $supplierId, array $pricingData): PurchaseOrder
    {
        return DB::transaction(function () use ($request, $supplierId, $pricingData) {
            // 1. إنشاء أمر الشراء الأساسي
            $po = PurchaseOrder::create([
                'po_number' => 'PO-' . strtoupper(Str::random(8)),
                'purchase_request_id' => $request->id,
                'supplier_id' => $supplierId,
                'project_id' => $request->project_id,
                'created_by' => Auth::id(),
                'order_date' => now(),
                'status' => 'draft',
                'total_amount' => 0 // سيتم تحديثه بعد إضافة البنود
            ]);

            $totalAmount = 0;

            // 2. إضافة البنود بناءً على أسعار المزود المحددة
            foreach ($request->items as $item) {
                $unitPrice = $pricingData[$item->material_id] ?? 0;
                $itemTotal = $item->quantity * $unitPrice;
                
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'material_id' => $item->material_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $unitPrice,
                    'total_item_price' => $itemTotal
                ]);

                $totalAmount += $itemTotal;
            }

            // 3. تحديث المجموع الكلي وحالة طلب الشراء
            $po->update(['total_amount' => $totalAmount]);
            $request->update(['status' => 'ordered']);

            // 4. تحديث ميزانية المشروع (Committed Cost)
            $this->updateProjectBudget($po->project_id, 'Materials', $totalAmount);

            return $po->load(['items.material', 'supplier']);
        });
    }

    private function updateProjectBudget(string $projectId, string $category, float $amount): void
    {
        $budget = \App\Modules\CostControl\Models\ProjectBudget::firstOrCreate(
            ['project_id' => $projectId, 'category' => $category],
            ['estimated_amount' => 0, 'actual_spent' => 0]
        );

        $budget->increment('actual_spent', $amount);
    }

    public function updatePoStatus(PurchaseOrder $po, string $status): bool
    {
        return $po->update(['status' => $status]);
    }
}
