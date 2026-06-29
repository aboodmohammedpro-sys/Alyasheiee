<?php

namespace App\Modules\DailyOperations\Models;

use App\Modules\ResourceAllocation\Models\Equipment;
use App\Modules\Procurement\Models\Material;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyTrip extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'daily_log_id', 'equipment_id', 'material_id', 'from_location', 'to_location', 'trip_count', 'quantity'
    ];

    public function dailyLog(): BelongsTo
    {
        return $this->belongsTo(DailyLog::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
