<?php

namespace App\Modules\FuelManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\FuelManagement\Models\FuelTank;
use App\Modules\FuelManagement\Services\FuelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FuelController extends Controller
{
    protected $fuelService;

    public function __construct(FuelService $fuelService)
    {
        $this->fuelService = $fuelService;
    }

    public function getTanks(): JsonResponse
    {
        return response()->json(FuelTank::all());
    }

    public function storeTank(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:static,mobile',
            'capacity' => 'required|numeric|min:0',
            'project_id' => 'nullable|uuid|exists:projects,id'
        ]);

        $tank = FuelTank::create($validated);
        return response()->json($tank, 201);
    }

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
            return response()->json([
                'message' => 'Fuel dispensed correctly.',
                'transaction' => $transaction
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
