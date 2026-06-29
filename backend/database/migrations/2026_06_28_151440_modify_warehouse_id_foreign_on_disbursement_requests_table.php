<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('disbursement_requests', function (Blueprint $table) {
            // 1. حذف القيد القديم المشير لخزانات الوقود
            $table->dropForeign(['warehouse_id']);
        });

        // 2. تصفير الحقل للمشاكل السابقة مع القيد الجديد
        \Illuminate\Support\Facades\DB::table('disbursement_requests')->update(['warehouse_id' => null]);

        Schema::table('disbursement_requests', function (Blueprint $table) {
            // 3. إعادة توجيه القيد ليشير لجدول المستودعات warehouses
            $table->foreign('warehouse_id')
                ->references('id')
                ->on('warehouses')
                ->nullOnDelete();

            // 4. إضافة حقل خزان الوقود بشكل مستقل كـ Nullable ومشار إليه في جدول خزانات الوقود
            $table->foreignUuid('fuel_tank_id')
                ->nullable()
                ->constrained('fuel_tanks')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('disbursement_requests', function (Blueprint $table) {
            $table->dropForeign(['fuel_tank_id']);
            $table->dropColumn('fuel_tank_id');

            $table->dropForeign(['warehouse_id']);
            $table->foreign('warehouse_id')
                ->references('id')
                ->on('fuel_tanks')
                ->nullOnDelete();
        });
    }
};
