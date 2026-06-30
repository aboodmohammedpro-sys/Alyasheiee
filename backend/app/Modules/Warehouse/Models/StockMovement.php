<?php

namespace App\Modules\Warehouse\Models;

use App\Modules\Procurement\Models\Material;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    use HasFactory, HasUuids;

    /**
     * دفتر الأستاذ - سجل تاريخي لجميع حركات المخزون.
     * كل تغيير في الرصيد (زيادة أو نقصان) يجب أن يولّد سجلاً هنا.
     *
     * Types:
     *   receipt      - استلام من مورد (GRN)
     *   issue        - صرف للمشروع/المعدات
     *   transfer_out - خروج بضاعة لمستودع آخر
     *   transfer_in  - دخول بضاعة محولة من مستودع آخر
     *   adjustment   - تسوية يدوية (جرد)
     */
    protected $fillable = [
        'warehouse_id',
        'material_id',
        'type',
        'quantity',       // موجب = دخول, سالب = خروج
        'reference_type', // مثال: 'GoodsReceivedNote', 'DisbursementRequest', 'InventoryTransfer'
        'reference_id',   // UUID للكيان المرجعي
        'reference_no',   // الرقم البشري القابل للقراءة (GRN-XXX, REQ-XXX)
        'notes',
        'performed_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'performed_by');
    }
}
