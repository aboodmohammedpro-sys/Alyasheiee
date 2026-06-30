<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Procurement\Models\PurchaseRequest;
use App\Modules\Procurement\Services\PurchaseRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseRequestController extends BaseController
{
    protected $service;

    public function __construct(PurchaseRequestService $service)
    {
        $this->service = $service;
    }

    /**
     * قائمة طلبات الشراء
     */
    public function index(Request $request): JsonResponse
    {
        $query = PurchaseRequest::with(['project', 'requester', 'items.material']);

        if ($request->has('project_id')) {
            $query->where('project_id', $request->query('project_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        return $this->successResponse($query->latest()->get());
    }

    /**
     * إنشاء طلب شراء جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id'                   => 'required|uuid|exists:projects,id',
            'required_date'                => 'nullable|date',
            'notes'                        => 'nullable|string',
            'items'                        => 'required|array|min:1',
            'items.*.material_id'          => 'required|uuid|exists:materials,id',
            'items.*.quantity'             => 'required|numeric|min:0.01',
            'items.*.estimated_unit_price' => 'nullable|numeric',
        ]);

        try {
            $purchaseRequest = $this->service->createRequest($validated);
            return $this->successResponse(
                $purchaseRequest,
                'تم إنشاء طلب الشراء بنجاح.',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * عرض تفاصيل طلب الشراء
     */
    public function show(PurchaseRequest $purchaseRequest): JsonResponse
    {
        return $this->successResponse(
            $purchaseRequest->load(['project', 'requester', 'items.material'])
        );
    }

    /**
     * تحديث حالة طلب الشراء (اعتماد / رفض / إلخ)
     */
    public function updateStatus(Request $request, PurchaseRequest $purchaseRequest): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:draft,submitted,approved,rejected,ordered',
        ]);

        try {
            $this->service->updateStatus($purchaseRequest, $validated['status']);
            return $this->successResponse(
                $purchaseRequest->fresh(['project', 'requester', 'items.material']),
                'تم تحديث حالة طلب الشراء بنجاح.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
