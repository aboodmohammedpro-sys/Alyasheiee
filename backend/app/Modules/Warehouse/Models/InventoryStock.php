<?php

namespace App\Modules\Warehouse\Models;

use App\Modules\Procurement\Models\Material;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryStock extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'inventory_stocks';

    protected $fillable = [
        'warehouse_id', 'material_id', 'quantity'
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
