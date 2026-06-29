<?php

namespace App\Modules\CostControl\Services;

use App\Modules\CostControl\Models\ProjectBudget;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\DailyOperations\Models\DailyAchievement;
use Illuminate\Support\Facades\DB;

class ReportingService
{
    /**
     * ملخص مالي للمشروع (Budget vs Actual)
     */
    public function getProjectFinancialSummary(string $projectId): array
    {
        $budgets = ProjectBudget::where('project_id', $projectId)->get();
        
        $summary = [
            'total_estimated' => $budgets->sum('estimated_amount'),
            'total_actual' => $budgets->sum('actual_spent'),
            'categories' => $budgets->map(function ($b) {
                return [
                    'category' => $b->category,
                    'estimated' => $b->estimated_amount,
                    'actual' => $b->actual_spent,
                    'variance' => $b->estimated_amount - $b->actual_spent,
                    'burn_rate' => $b->estimated_amount > 0 ? round(($b->actual_spent / $b->estimated_amount) * 100, 2) : 0
                ];
            })
        ];

        return $summary;
    }

    /**
     * ملخص إنجازات المشروع
     */
    public function getProjectAchievements(string $projectId): array
    {
        return DailyAchievement::whereHas('dailyLog', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })
        ->select('activity_name', 'unit', DB::raw('SUM(quantity) as total_quantity'))
        ->groupBy('activity_name', 'unit')
        ->get()
        ->toArray();
    }
}
