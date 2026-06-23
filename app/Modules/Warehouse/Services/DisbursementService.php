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

    /**
     * الموافقة النهائية وتحديد المخزن (بواسطة مدير المشروع)
     */
    public function approveRequest(DisbursementRequest $request, string $warehouseId): DisbursementRequest
    {
        $request->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'warehouse_id' => $warehouseId,
        ]);

        // ملاحظة: هنا يمكن إرسال إشعار فوري (Notification) إلى مسؤول المستودع المختار
        
        return $request;
    }
}
