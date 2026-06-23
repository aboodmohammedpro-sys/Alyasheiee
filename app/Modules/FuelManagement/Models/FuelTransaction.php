<?php

namespace App\Modules\FuelManagement\Models;

use App\Models\User;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\ResourceAllocation\Models\Equipment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FuelTransaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'type', 'from_tank_id', 'to_tank_id', 'equipment_id', 
        'project_id', 'quantity', 'odometer_reading', 'dispatcher_id', 'notes'
    ];

    public function fromTank(): BelongsTo
    {
        return $this->belongsTo(FuelTank::class, 'from_tank_id');
    }

    public function toTank(): BelongsTo
    {
        return $this->belongsTo(FuelTank::class, 'to_tank_id');
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function dispatcher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dispatcher_id');
    }
}
