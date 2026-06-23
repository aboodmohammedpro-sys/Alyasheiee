<?php

namespace App\Modules\CostControl\Services;

use App\Modules\CostControl\Models\CostLog;
use App\Modules\CostControl\Models\ProjectBudget;
use App\Modules\DailyOperations\Models\DailyLog;
use App\Modules\Warehouse\Models\DisbursementRequest;
use App\Modules\FuelManagement\Models\FuelTransaction;
use Illuminate\Support\Facades\DB;

class CostService
{
    /**
     * حساب وتسجيل تكاليف السجل اليومي (عمالة ومعدات)
     */
    public function logDailyOperationsCosts(DailyLog $log)
    {
        DB::transaction(function () use ($log) {
            foreach ($log->laborAttendance as $attendance) {
                $employee = $attendance->employee;
                if ($employee && $employee->hourly_rate > 0) {
                    $amount = $attendance->hours * $employee->hourly_rate;
                    $this->createCostLog($log->project_id, 'daily_log', $log->id, 'labor', $amount, "Labor: " . $employee->name);
                }
            }

            foreach ($log->equipmentUsage as $usage) {
                $equipment = $usage->equipment;
                if ($equipment && $equipment->hourly_rate > 0) {
                    $amount = $usage->work_hours * $equipment->hourly_rate;
                    $this->createCostLog($log->project_id, 'daily_log', $log->id, 'equipment', $amount, "Equipment: " . $equipment->name);
                }
            }
        });
    }

    /**
     * تسجيل تكلفة الوقود
     */
    public function logFuelCost(FuelTransaction $tx)
    {
        // نفترض سعر لتر الديزل ثابت حالياً أو يُجلب من إعدادات المادة
        $unitPrice = 2.15; // مثال
        $amount = $tx->quantity * $unitPrice;
        
        $this->createCostLog($tx->project_id, 'fuel_transaction', $tx->id, 'fuel', $amount, "Fuel for: " . ($tx->equipment->name ?? 'N/A'));
    }

    private function createCostLog($projectId, $sourceType, $sourceId, $category, $amount, $description)
    {
        CostLog::create([
            'project_id' => $projectId,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'category' => $category,
            'amount' => $amount,
            'transaction_date' => now(),
            'description' => $description
        ]);

        // تحديث ميزانية المشروع آلياً
        ProjectBudget::where('project_id', $projectId)
            ->where('category', $category)
            ->increment('actual_spent', $amount);
    }
}
