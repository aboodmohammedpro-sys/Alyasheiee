<?php

namespace App\Modules\Warehouse\Models;

use App\Modules\Procurement\Models\Material;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryTransferItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'transfer_id',
        'material_id',
        'quantity_requested',
        'quantity_shipped',
        'quantity_received',
    ];

    protected $casts = [
        'quantity_requested' => 'decimal:4',
        'quantity_shipped'   => 'decimal:4',
        'quantity_received'  => 'decimal:4',
    ];

    public function transfer(): BelongsTo
    {
        return $this->belongsTo(InventoryTransfer::class, 'transfer_id');
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
