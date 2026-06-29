<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisbursementRequestItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['request_id', 'material_id', 'item_name', 'quantity', 'unit'];

    public function request(): BelongsTo
    {
        return $this->belongsTo(DisbursementRequest::class, 'request_id');
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Procurement\Models\Material::class, 'material_id');
    }
}
