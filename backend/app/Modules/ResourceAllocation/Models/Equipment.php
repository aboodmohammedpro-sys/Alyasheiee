<?php

namespace App\Modules\ResourceAllocation\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'equipment';

    protected $fillable = [
        'code', 'name', 'type', 'serial_number', 'brand', 'status', 'purchase_date', 'hourly_rate',
        'fuel_tracking_type', 'standard_consumption_rate', 'fuel_tolerance_percentage', 'last_meter_reading'
    ];

    public function assignments(): MorphMany
    {
        return $this->morphMany(ProjectAssignment::class, 'assignable');
    }
}
