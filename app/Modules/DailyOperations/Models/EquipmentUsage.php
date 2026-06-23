<?php

namespace App\Modules\DailyOperations\Models;

use App\Modules\ResourceAllocation\Models\Equipment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentUsage extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'equipment_usage';

    protected $fillable = [
        'daily_log_id', 'equipment_id', 'start_meter', 'end_meter', 'work_hours', 'status'
    ];

    public function dailyLog(): BelongsTo
    {
        return $this->belongsTo(DailyLog::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}
