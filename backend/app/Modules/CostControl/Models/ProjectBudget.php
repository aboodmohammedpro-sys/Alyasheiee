<?php

namespace App\Modules\CostControl\Models;

use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectBudget extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['project_id', 'category', 'estimated_amount', 'actual_spent'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
