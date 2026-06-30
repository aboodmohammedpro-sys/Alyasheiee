<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Warehouse\Models\InventoryTransfer;
use App\Modules\Warehouse\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransferController extends BaseController
{
    public function __construct(protected InventoryService $inventoryService) {}

    /**
     * إنشاء طلب تحويل بين مستودعين
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'source_warehouse_id' => 'required|uuid|exists:warehouses,id',
            'target_warehouse_id' => 'required|uuid|exists:warehouses,id|different:source_warehouse_id',
            'notes'               => 'nullable|string',
            'items'               => 'required|array|min:1',
            'items.*.material_id' => 'required|uuid|exists:materials,id',
            'items.*.quantity'    => 'required|numeric|min:0.0001',
        ]);

        $transfer = $this->inventoryService->createTransfer($validated);
        return $this->successResponse($transfer, 'Transfer request created.', 201);
    }

    /**
     * شحن التحويل (أمين المستودع المصدر)
     * يخصم البضاعة من المصدر ويضعها في حالة in-transit
     */
    public function ship(InventoryTransfer $inventoryTransfer): JsonResponse
    {
        try {
            $transfer = $this->inventoryService->shipTransfer($inventoryTransfer);
            return $this->successResponse($transfer, 'Transfer shipped. Stock deducted from source warehouse.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * استلام التحويل (أمين المستودع الوجهة)
     * يضيف البضاعة لأرصدة المستودع الوجهة ويكمل الدورة
     */
    public function receive(Request $request, InventoryTransfer $inventoryTransfer): JsonResponse
    {
        $validated = $request->validate([
            'received_quantities'               => 'nullable|array',
            'received_quantities.*.material_id' => 'uuid|exists:materials,id',
            'received_quantities.*.quantity'    => 'numeric|min:0',
        ]);

        // تحويل المصفوفة لتكون مفهرسة بـ material_id
        $receivedMap = [];
        foreach ($validated['received_quantities'] ?? [] as $rq) {
            $receivedMap[$rq['material_id']] = $rq['quantity'];
        }

        try {
            $transfer = $this->inventoryService->receiveTransfer($inventoryTransfer, $receivedMap);
            return $this->successResponse($transfer, 'Transfer received. Stock added to target warehouse.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
