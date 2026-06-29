<?php

namespace App\Modules\FuelManagement\Models;

use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FuelTank extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = ['name', 'type', 'capacity', 'current_balance', 'project_id'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
