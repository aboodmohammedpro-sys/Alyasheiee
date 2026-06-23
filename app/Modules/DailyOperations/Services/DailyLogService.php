<?php

namespace App\Modules\DailyOperations\Services;

use App\Modules\DailyOperations\Models\DailyLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DailyLogService
{
    public function createDailyLog(array $data): DailyLog
    {
        return DB::transaction(function () use ($data) {
            // 1. إنشاء السجل الأساسي
            $dailyLog = DailyLog::create([
                'project_id' => $data['project_id'],
                'recorder_id' => Auth::id(),
                'date' => $data['date'],
                'general_notes' => $data['general_notes'] ?? null,
                'status' => 'draft'
            ]);

            // 2. إضافة حضور العمال
            if (isset($data['labor_attendance'])) {
                foreach ($data['labor_attendance'] as $attendance) {
                    $dailyLog->laborAttendance()->create($attendance);
                }
            }

            // 3. إضافة استخدام المعدات
            if (isset($data['equipment_usage'])) {
                foreach ($data['equipment_usage'] as $usage) {
                    $dailyLog->equipmentUsage()->create($usage);
                }
            }

            return $dailyLog->load(['laborAttendance', 'equipmentUsage']);
        });
    }

    public function submitForApproval(DailyLog $dailyLog): bool
    {
        if ($dailyLog->status !== 'draft') {
            throw new \Exception("Only draft logs can be submitted.");
        }

        return $dailyLog->update(['status' => 'submitted']);
    }

    public function approveLog(DailyLog $dailyLog, string $approverId): bool
    {
        return $dailyLog->update([
            'status' => 'approved',
            'approver_id' => $approverId
        ]);
    }
}
