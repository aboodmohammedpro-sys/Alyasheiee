<?php

namespace App\Modules\CostControl\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\CostControl\Services\ReportingService;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Http\JsonResponse;

class ReportController extends BaseController
{
    protected $reportService;

    public function __construct(ReportingService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Web Only: لوحة معلومات المشروع المالية
     */
    public function projectDashboard(Project $project): JsonResponse
    {
        $financials = $this->reportService->getProjectFinancialSummary($project->id);
        $achievements = $this->reportService->getProjectAchievements($project->id);

        return $this->successResponse([
            'project' => $project->only(['id', 'name', 'code']),
            'financials' => $financials,
            'achievements' => $achievements
        ]);
    }
}
