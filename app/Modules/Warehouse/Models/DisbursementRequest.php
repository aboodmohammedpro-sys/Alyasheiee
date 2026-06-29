<?php

namespace App\Modules\Warehouse\Models;

use App\Models\User;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\FuelManagement\Models\FuelTank;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DisbursementRequest extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'request_number', 'project_id', 'requester_id', 'type', 
        'status', 'confirmed_by', 'confirmed_at', 
        'approved_by', 'approved_at', 'warehouse_id', 'fuel_tank_id', 'notes'
    ];

    public function items(): HasMany
    {
        return $this->hasMany(DisbursementRequestItem::class, 'request_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function fuelTank(): BelongsTo
    {
        return $this->belongsTo(FuelTank::class, 'fuel_tank_id');
    }
}
