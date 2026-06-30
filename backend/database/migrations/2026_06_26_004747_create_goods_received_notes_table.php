<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // إشعار استلام المواد (GRN)
        Schema::create('goods_received_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('grn_number')->unique();
            $table->foreignUuid('purchase_order_id')->constrained('purchase_orders');
            $table->foreignUuid('warehouse_id')->constrained('warehouses');
            $table->foreignId('received_by')->constrained('users');
            
            $table->date('received_date');
            $table->string('delivery_note_number')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });

        // بنود إشعار الاستلام
        Schema::create('grn_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('goods_received_note_id')->constrained('goods_received_notes')->cascadeOnDelete();
            $table->foreignUuid('material_id')->constrained('materials');
            
            $table->decimal('quantity_ordered', 12, 2);
            $table->decimal('quantity_received', 12, 2);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grn_items');
        Schema::dropIfExists('goods_received_notes');
    }
};
