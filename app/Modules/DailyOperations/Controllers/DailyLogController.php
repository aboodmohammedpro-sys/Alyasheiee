<?php

namespace App\Modules\DailyOperations\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\DailyOperations\Requests\StoreDailyLogRequest;
use App\Modules\DailyOperations\Resources\DailyLogResource;
use App\Modules\DailyOperations\Services\DailyLogService;
use App\Modules\DailyOperations\Models\DailyLog;
use Illuminate\Http\JsonResponse;

class DailyLogController extends Controller
{
    protected $dailyLogService;

    public function __construct(DailyLogService $dailyLogService)
    {
        $this->dailyLogService = $dailyLogService;
    }

    public function store(StoreDailyLogRequest $request): JsonResponse
    {
        $dailyLog = $this->dailyLogService->createDailyLog($request->validated());

        return response()->json([
            'message' => 'Daily log created successfully.',
            'data' => new DailyLogResource($dailyLog)
        ], 210); // 201 Created
    }

    public function show(DailyLog $dailyLog): DailyLogResource
    {
        $dailyLog->load(['project', 'recorder', 'laborAttendance.employee', 'equipmentUsage.equipment']);
        return new DailyLogResource($dailyLog);
    }

    public function submit(DailyLog $dailyLog): JsonResponse
    {
        $this->dailyLogService->submitForApproval($dailyLog);

        return response()->json([
            'message' => 'Daily log submitted for approval.'
        ]);
    }
}
