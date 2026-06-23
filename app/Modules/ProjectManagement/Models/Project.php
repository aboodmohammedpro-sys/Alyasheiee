<?php

namespace App\Modules\ProjectManagement\Models;

use App\Modules\ProjectManagement\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Project extends Model
{
    use HasFactory, HasUuids, SoftDeletes, LogsActivity;

    protected $fillable = [
        'code',
        'name',
        'client_name',
        'location',
        'start_date',
        'expected_end_date',
        'estimated_budget',
        'progress_percentage',
        'status',
        'description',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'estimated_budget' => 'decimal:2',
        'progress_percentage' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'name', 'status', 'progress_percentage'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function phases(): HasMany
    {
        return $this->hasMany(ProjectPhase::class);
    }
}
