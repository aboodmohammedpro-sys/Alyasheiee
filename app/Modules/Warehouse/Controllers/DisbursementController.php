<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Warehouse\Models\DisbursementRequest;
use App\Modules\Warehouse\Services\DisbursementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisbursementController extends BaseController
{
    protected $disbursementService;

    public function __construct(DisbursementService $disbursementService)
    {
        $this->disbursementService = $disbursementService;
    }

    /**
     * Mobile/Web: إنشاء طلب صرف جديد (المراقب)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'type' => 'required|in:material,spare_part,fuel,oil',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.unit' => 'nullable|string',
        ]);

        $disbursementRequest = $this->disbursementService->createRequest($validated);
        return $this->successResponse($disbursementRequest->load('items'), 'Disbursement request created.', 201);
    }

    /**
     * Mobile: تأكيد الطلب (كبير المراقبين)
     */
    public function confirm(DisbursementRequest $disbursementRequest): JsonResponse
    {
        $updated = $this->disbursementService->confirmRequest($disbursementRequest);
        return $this->successResponse($updated, 'Request confirmed.');
    }

    /**
     * Web Only: الموافقة وتحديد المخزن (مدير المشروع)
     */
    public function approve(Request $request, DisbursementRequest $disbursementRequest): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|uuid' 
        ]);

        $updated = $this->disbursementService->approveRequest($disbursementRequest, $validated['warehouse_id']);
        return $this->successResponse($updated, 'Request approved by PM.');
    }

    /**
     * Mobile/Web: التنفيذ الفعلي (أمين المستودع)
     */
    public function issue(DisbursementRequest $disbursementRequest): JsonResponse
    {
        $updated = $this->disbursementService->issueRequest($disbursementRequest);
        return $this->successResponse($updated, 'Materials issued from warehouse.');
    }
}
