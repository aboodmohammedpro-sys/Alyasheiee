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
            $equipment = \App\Modules\ResourceAllocation\Models\Equipment::findOrFail($data['equipment_id']);
            
            if ($tank->current_balance < $data['quantity']) {
                throw new \Exception("Insufficient fuel balance in the tank.");
            }

            // 1. حساب المسافة/الساعات منذ آخر تعبئة
            $currentReading = $data['odometer_reading'] ?? 0;
            $previousReading = $equipment->last_meter_reading;
            $diff = $currentReading - $previousReading;

            $status = 'normal';
            if ($diff > 0 && $equipment->standard_consumption_rate > 0) {
                $actualRate = $data['quantity'] / $diff;
                $standard = $equipment->standard_consumption_rate;
                $tolerance = $equipment->fuel_tolerance_percentage / 100;

                // إذا تجاوز الاستهلاك المعدل القياسي + الهامش
                if ($actualRate > ($standard * (1 + $tolerance))) {
                    $status = 'anomaly'; // اشتباه في هدر أو تسريب
                }
            }

            // 2. تسجيل المعاملة
            $transaction = FuelTransaction::create([
                'type' => 'dispensing',
                'from_tank_id' => $tank->id,
                'equipment_id' => $equipment->id,
                'project_id' => $data['project_id'],
                'quantity' => $data['quantity'],
                'odometer_reading' => $currentReading,
                'dispatcher_id' => Auth::id(),
                'status' => $status, // تم إضافة حقل الحالة (سيتم تعديل الموديل أدناه)
                'notes' => $data['notes'] ?? null
            ]);

            // 3. تحديث بيانات المعدة
            $equipment->update(['last_meter_reading' => $currentReading]);
            $tank->decrement('current_balance', $data['quantity']);

            // تسجيل التكلفة
            app(\App\Modules\CostControl\Services\CostService::class)->logFuelCost($transaction);

            return $transaction;
        });
    }
}
