<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\DisbursementRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class DisbursementService
{
    /**
     * إنشاء طلب صرف جديد (بواسطة المراقب)
     */
    public function createRequest(array $data): DisbursementRequest
    {
        $request = DisbursementRequest::create([
            'request_number' => 'REQ-' . strtoupper(Str::random(8)),
            'project_id' => $data['project_id'],
            'requester_id' => Auth::id(),
            'type' => $data['type'],
            'status' => 'draft',
            'notes' => $data['notes'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $request->items()->create($item);
        }

        return $request;
    }

    /**
     * تأكيد الطلب (بواسطة كبير المراقبين)
     */
    public function confirmRequest(DisbursementRequest $request): DisbursementRequest
    {
        $request->update([
            'status' => 'confirmed',
            'confirmed_by' => Auth::id(),
            'confirmed_at' => now(),
        ]);

        return $request;
    }

    public function approveRequest(DisbursementRequest $request, ?string $warehouseId = null, ?string $fuelTankId = null): DisbursementRequest
    {
        $request->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'warehouse_id' => $warehouseId,
            'fuel_tank_id' => $fuelTankId,
        ]);

        return $request;
    }

    public function issueRequest(DisbursementRequest $request): DisbursementRequest
    {
        if ($request->status !== 'approved') {
            throw new \Exception("Only approved requests can be issued.");
        }

        return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            $request->update([
                'status' => 'issued',
                'updated_at' => now(),
            ]);

            $inventoryService = app(\App\Modules\Warehouse\Services\InventoryService::class);

            foreach ($request->items as $item) {
                if ($item->material_id && $request->warehouse_id) {
                    // خصم الكمية من رصيد المستودع
                    $inventoryService->updateStock(
                        $request->warehouse_id,
                        $item->material_id,
                        -$item->quantity
                    );

                    // تسجيل الصرف المالي للمواد إذا تواجد السعر
                    $material = \App\Modules\Procurement\Models\Material::find($item->material_id);
                    if ($material && $material->unit_price > 0) {
                        $costAmount = $item->quantity * $material->unit_price;
                        app(\App\Modules\CostControl\Services\CostService::class)->logMaterialDisbursementCost(
                            $request->project_id,
                            $request->id,
                            $material->category, // استخدام فئة المادة الدقيقة
                            $costAmount,
                            "Issued: {$item->quantity} {$material->unit} of {$material->name} from Warehouse"
                        );
                    }
                }
            }

            return $request;
        });
    }
}
