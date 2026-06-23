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

    public function approveRequest(DisbursementRequest $request, string $warehouseId): DisbursementRequest
    {
        $request->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'warehouse_id' => $warehouseId,
        ]);

        return $request;
    }

    /**
     * التنفيذ الفعلي للصرف (بواسطة أمين المستودع)
     */
    public function issueRequest(DisbursementRequest $request): DisbursementRequest
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            $request->update([
                'status' => 'issued',
                'updated_at' => now(),
            ]);

            // هنا يتم تحديث المخازن (Inventory) بناءً على النوع
            if ($request->type === 'fuel') {
                // منطق إضافي إذا كان الوقود يصرف من خزان غير مسجل في FuelService
            }

            return $request;
        });
    }
}
