<?php

namespace App\Modules\ResourceAllocation\Models;

use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectAssignment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'project_id', 'assignable_id', 'assignable_type', 'start_date', 'end_date', 'status', 'notes'
    ];

    public function assignable(): MorphTo
    {
        return $this->morphTo();
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
