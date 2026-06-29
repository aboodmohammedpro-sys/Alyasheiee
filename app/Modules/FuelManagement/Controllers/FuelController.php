<?php

namespace App\Modules\FuelManagement\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\FuelManagement\Models\FuelTank;
use App\Modules\FuelManagement\Services\FuelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FuelController extends BaseController
{
    protected $fuelService;

    public function __construct(FuelService $fuelService)
    {
        $this->fuelService = $fuelService;
    }

    /**
     * Shared: قائمة خزانات الوقود وأرصدتها
     */
    public function getTanks(): JsonResponse
    {
        return $this->successResponse(FuelTank::all());
    }

    /**
     * Web Only: إدارة الخزانات
     */
    public function storeTank(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:static,mobile',
            'capacity' => 'required|numeric|min:0',
            'project_id' => 'nullable|uuid|exists:projects,id'
        ]);

        $tank = FuelTank::create($validated);
        return $this->successResponse($tank, 'Fuel tank created successfully.', 201);
    }

    /**
     * Mobile Only: عملية تعبئة معدة
     */
    public function dispense(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_tank_id' => 'required|uuid|exists:fuel_tanks,id',
            'equipment_id' => 'required|uuid|exists:equipment,id',
            'project_id' => 'required|uuid|exists:projects,id',
            'quantity' => 'required|numeric|min:0.5',
            'odometer_reading' => 'nullable|numeric'
        ]);

        try {
            $transaction = $this->fuelService->dispenseFuel($validated);
            return $this->successResponse($transaction, 'Fuel dispensed correctly.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
