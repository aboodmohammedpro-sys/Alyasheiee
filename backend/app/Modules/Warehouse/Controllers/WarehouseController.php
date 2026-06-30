<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Warehouse\Models\Warehouse;
use App\Modules\Warehouse\Models\InventoryStock;
use Illuminate\Http\JsonResponse;

class WarehouseController extends BaseController
{
    /**
     * قائمة المستودعات
     */
    public function index(): JsonResponse
    {
        $warehouses = Warehouse::where('is_active', true)->get();
        return $this->successResponse($warehouses);
    }

    /**
     * عرض تفاصيل مستودع
     */
    public function show(Warehouse $warehouse): JsonResponse
    {
        return $this->successResponse($warehouse->load('stocks'));
    }

    /**
     * عرض مخزون مستودع معين
     */
    public function stock(Warehouse $warehouse): JsonResponse
    {
        $stock = InventoryStock::where('warehouse_id', $warehouse->id)
            ->with('material')
            ->get();

        return $this->successResponse($stock);
    }
}
