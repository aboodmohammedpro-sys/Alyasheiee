<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Procurement\Models\PurchaseOrder;
use App\Modules\Warehouse\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrnController extends BaseController
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Mobile/Web: تنفيذ استلام مواد (Storekeeper)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|uuid|exists:purchase_orders,id',
            'warehouse_id' => 'required|uuid|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|uuid|exists:materials,id',
            'items.*.quantity_received' => 'required|numeric|min:0',
        ]);

        try {
            $po = PurchaseOrder::findOrFail($validated['purchase_order_id']);
            
            $grn = $this->inventoryService->receiveMaterials(
                $po,
                $validated['warehouse_id'],
                $validated['items']
            );

            return $this->successResponse($grn, 'Goods received and inventory updated.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
