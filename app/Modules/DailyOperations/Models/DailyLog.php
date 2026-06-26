<?php

namespace App\Modules\DailyOperations\Models;

use App\Models\User;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyLog extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'project_id', 'recorder_id', 'approver_id', 'date', 'status', 'general_notes'
    ];

    protected $casts = [
        'date' => 'date'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorder_id');
    }

    public function laborAttendance(): HasMany
    {
        return $this->hasMany(LaborAttendance::class);
    }

    public function equipmentUsage(): HasMany
    {
        return $this->hasMany(EquipmentUsage::class);
    }

    public function trips(): HasMany
    {
        return $this->hasMany(DailyTrip::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(DailyAchievement::class);
    }
}
