<?php

namespace App\Modules\DailyOperations\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyAchievement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'daily_log_id', 'activity_name', 'quantity', 'unit', 'notes'
    ];

    public function dailyLog(): BelongsTo
    {
        return $this->belongsTo(DailyLog::class);
    }
}
