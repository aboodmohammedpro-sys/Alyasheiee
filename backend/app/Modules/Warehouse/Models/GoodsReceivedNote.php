<?php

namespace App\Modules\Warehouse\Models;

use App\Models\User;
use App\Modules\Procurement\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GoodsReceivedNote extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'grn_number', 'purchase_order_id', 'warehouse_id', 'received_by',
        'received_date', 'delivery_note_number', 'notes'
    ];

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(GrnItem::class);
    }
}
