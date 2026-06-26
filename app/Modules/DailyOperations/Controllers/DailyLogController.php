<?php

namespace App\Modules\DailyOperations\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\DailyOperations\Requests\StoreDailyLogRequest;
use App\Modules\DailyOperations\Resources\DailyLogResource;
use App\Modules\DailyOperations\Services\DailyLogService;
use App\Modules\DailyOperations\Models\DailyLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DailyLogController extends BaseController
{
    protected $dailyLogService;

    public function __construct(DailyLogService $dailyLogService)
    {
        $this->dailyLogService = $dailyLogService;
    }

    /**
     * Mobile: تسجيل يومية جديدة (Recorder)
     */
    public function store(StoreDailyLogRequest $request): JsonResponse
    {
        $dailyLog = $this->dailyLogService->createDailyLog($request->validated());

        return $this->successResponse(
            new DailyLogResource($dailyLog),
            'Daily log created successfully.',
            201
        );
    }

    /**
     * Shared/Web: عرض تفاصيل اليومية
     */
    public function show(DailyLog $dailyLog): JsonResponse
    {
        $dailyLog->load(['project', 'recorder', 'laborAttendance.employee', 'equipmentUsage.equipment']);
        return $this->successResponse(new DailyLogResource($dailyLog));
    }

    /**
     * Mobile: إرسال للمراجعة (Recorder)
     */
    public function submit(DailyLog $dailyLog): JsonResponse
    {
        $this->dailyLogService->submitForApproval($dailyLog);
        return $this->successResponse(null, 'Daily log submitted for approval.');
    }

    /**
     * Mobile/Web: اعتماد اليومية (Senior Recorder / Admin)
     */
    public function approve(DailyLog $dailyLog): JsonResponse
    {
        try {
            $this->dailyLogService->approveLog($dailyLog, Auth::id());
            return $this->successResponse(null, 'Daily log approved and costs recorded.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
