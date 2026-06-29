<?php

namespace App\Modules\ProjectManagement\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectPhase extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'project_id',
        'name',
        'start_date',
        'end_date',
        'progress_percentage',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'progress_percentage' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
