<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * المستودع كيان مستقل لا يرتبط بمشروع واحد فقط.
     * يمكن للمستودع خدمة عدة مشاريع في آنٍ واحد
     * عبر جدول inventory_stocks الذي يربط المادة والمستودع.
     * الصرف للمشاريع يتم عبر disbursement_requests وليس عبر ربط مباشر.
     */
    protected $fillable = ['name', 'location', 'type', 'is_active'];

    // type: 'central' | 'site' | 'mobile'
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function stocks(): HasMany
    {
        return $this->hasMany(InventoryStock::class);
    }

    public function disbursementRequests(): HasMany
    {
        return $this->hasMany(DisbursementRequest::class);
    }

    public function transfersOut(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'source_warehouse_id');
    }

    public function transfersIn(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'target_warehouse_id');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
}
