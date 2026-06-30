<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Multi-Warehouse Support Migration:
     *
     * 1. warehouses: إزالة ارتباط project_id (المستودع مستقل عن المشاريع)
     *    وإضافة حقل is_active للتحكم في تفعيل/تعطيل المستودعات.
     *
     * 2. stock_movements: دفتر الأستاذ التاريخي لكل حركة مخزون
     *    (receipt / issue / transfer_in / transfer_out / adjustment)
     *
     * 3. inventory_transfers: رأس حركة التحويل بين المستودعات
     *    مع دورة حياة: pending -> shipped -> completed
     *
     * 4. inventory_transfer_items: بنود التحويل
     */
    public function up(): void
    {
        // 1. تعديل warehouses: إزالة project_id وإضافة is_active
        Schema::table('warehouses', function (Blueprint $table) {
            // إزالة العلاقة المباشرة بالمشروع
            $table->dropForeign(['project_id']);
            $table->dropColumn('project_id');
            // تفعيل/تعطيل المستودع
            $table->boolean('is_active')->default(true)->after('type');
        });

        // 2. دفتر الأستاذ - سجل جميع حركات المخزون
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignUuid('material_id')->constrained('materials')->cascadeOnDelete();
            $table->string('type'); // receipt, issue, transfer_in, transfer_out, adjustment
            $table->decimal('quantity', 14, 4); // موجب = دخول, سالب = خروج
            // المرجع المسبب لهذه الحركة (GRN, DisbursementRequest, InventoryTransfer ...)
            $table->string('reference_type')->nullable();
            $table->uuid('reference_id')->nullable();
            $table->string('reference_no')->nullable(); // رقم مقروء مثل GRN-XXXX
            $table->text('notes')->nullable();
            $table->foreignUuid('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // indexes للأداء في الاستعلامات الشائعة
            $table->index(['warehouse_id', 'material_id']);
            $table->index('type');
            $table->index(['reference_type', 'reference_id']);
        });

        // 3. رأس حركة التحويل بين المستودعات
        Schema::create('inventory_transfers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transfer_number')->unique();
            $table->foreignUuid('source_warehouse_id')->constrained('warehouses');
            $table->foreignUuid('target_warehouse_id')->constrained('warehouses');
            $table->string('status')->default('pending'); // pending, shipped, completed, cancelled
            $table->text('notes')->nullable();
            $table->foreignUuid('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('shipped_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });

        // 4. بنود التحويل
        Schema::create('inventory_transfer_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('transfer_id')->constrained('inventory_transfers')->cascadeOnDelete();
            $table->foreignUuid('material_id')->constrained('materials');
            $table->decimal('quantity_requested', 14, 4);
            $table->decimal('quantity_shipped', 14, 4)->default(0);
            $table->decimal('quantity_received', 14, 4)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transfer_items');
        Schema::dropIfExists('inventory_transfers');
        Schema::dropIfExists('stock_movements');

        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->foreignUuid('project_id')->nullable()->constrained('projects');
        });
    }
};
