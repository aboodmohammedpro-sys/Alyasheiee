<?php

namespace App\Modules\FuelManagement\Services;

use App\Modules\FuelManagement\Models\FuelTank;
use App\Modules\FuelManagement\Models\FuelTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class FuelService
{
    /**
     * استلام وقود من مورد خارجي إلى خزان
     */
    public function receiveFuel(FuelTank $tank, float $quantity, string $notes = null): FuelTransaction
    {
        return DB::transaction(function () use ($tank, $quantity, $notes) {
            $transaction = FuelTransaction::create([
                'type' => 'receiving',
                'to_tank_id' => $tank->id,
                'quantity' => $quantity,
                'dispatcher_id' => Auth::id(),
                'notes' => $notes
            ]);

            $tank->increment('current_balance', $quantity);

            return $transaction;
        });
    }

    /**
     * تعبئة وقود لمعدة من خزان (متحرك أو ثابت)
     */
    public function dispenseFuel(array $data): FuelTransaction
    {
        return DB::transaction(function () use ($data) {
            $tank = FuelTank::findOrFail($data['from_tank_id']);
            
            if ($tank->current_balance < $data['quantity']) {
                throw new \Exception("Insufficient fuel balance in the tank.");
            }

            $transaction = FuelTransaction::create([
                'type' => 'dispensing',
                'from_tank_id' => $tank->id,
                'equipment_id' => $data['equipment_id'],
                'project_id' => $data['project_id'],
                'quantity' => $data['quantity'],
                'odometer_reading' => $data['odometer_reading'] ?? null,
                'dispatcher_id' => Auth::id(),
                'notes' => $data['notes'] ?? null
            ]);

            $tank->decrement('current_balance', $data['quantity']);

            // تسجيل تكلفة الوقود آلياً
            app(\App\Modules\CostControl\Services\CostService::class)->logFuelCost($transaction);

            return $transaction;
        });
    }
}
