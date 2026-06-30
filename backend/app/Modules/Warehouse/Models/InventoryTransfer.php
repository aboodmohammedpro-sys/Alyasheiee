<?php

namespace App\Modules\Warehouse\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryTransfer extends Model
{
    use HasFactory, HasUuids;

    /**
     * طلب تحويل مواد من مستودع لآخر.
     *
     * Statuses:
     *   pending   - الطلب منشأ، لم يُشحن بعد
     *   shipped   - خُصمت البضاعة من المصدر، في طريقها (in-transit)
     *   completed - استُلمت في الوجهة، أُضيفت للأرصدة
     *   cancelled - ملغى
     */
    protected $fillable = [
        'transfer_number',
        'source_warehouse_id',
        'target_warehouse_id',
        'status',
        'notes',
        'requested_by',
        'shipped_by',
        'received_by',
        'shipped_at',
        'received_at',
    ];

    protected $casts = [
        'shipped_at'  => 'datetime',
        'received_at' => 'datetime',
    ];

    public function sourceWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'source_warehouse_id');
    }

    public function targetWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'target_warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InventoryTransferItem::class, 'transfer_id');
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function shippedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shipped_by');
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
