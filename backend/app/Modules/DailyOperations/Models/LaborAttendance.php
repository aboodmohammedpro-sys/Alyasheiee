<?php

namespace App\Modules\DailyOperations\Models;

use App\Modules\ResourceAllocation\Models\Employee;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaborAttendance extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'labor_attendance';

    protected $fillable = [
        'daily_log_id', 'employee_id', 'hours', 'overtime', 'status', 'notes'
    ];

    public function dailyLog(): BelongsTo
    {
        return $this->belongsTo(DailyLog::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
