<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Procurement\Models\PurchaseOrder;
use App\Modules\Procurement\Models\PurchaseRequest;
use App\Modules\Procurement\Services\PurchaseOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseOrderController extends BaseController
{
    protected $poService;

    public function __construct(PurchaseOrderService $poService)
    {
        $this->poService = $poService;
    }

    /**
     * Web Only: عرض كافة أوامر الشراء
     */
    public function index(): JsonResponse
    {
        $orders = PurchaseOrder::with(['project', 'supplier', 'creator'])->paginate();
        return $this->paginatedResponse($orders);
    }

    /**
     * Web Only: تحويل طلب شراء إلى أمر شراء
     */
    public function convert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'purchase_request_id' => 'required|uuid|exists:purchase_requests,id',
            'supplier_id' => 'required|uuid|exists:suppliers,id',
            'pricing' => 'required|array', // [material_id => unit_price]
        ]);

        try {
            $pr = PurchaseRequest::findOrFail($validated['purchase_request_id']);
            
            if ($pr->status !== 'approved') {
                return $this->errorResponse('Only approved PRs can be converted to PO.', 422);
            }

            $po = $this->poService->convertRequestToOrder(
                $pr, 
                $validated['supplier_id'], 
                $validated['pricing']
            );

            return $this->successResponse($po, 'Purchase Order issued successfully.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Shared: تفاصيل أمر الشراء
     */
    public function show(PurchaseOrder $purchaseOrder): JsonResponse
    {
        return $this->successResponse($purchaseOrder->load(['items.material', 'supplier', 'project']));
    }
}
