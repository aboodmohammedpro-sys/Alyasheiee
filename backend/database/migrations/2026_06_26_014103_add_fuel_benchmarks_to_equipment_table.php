<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('equipment', function (Blueprint $table) {
            // نوع تتبع الاستهلاك: ساعات عمل (hours) أم كيلومترات (km)
            $table->string('fuel_tracking_type')->default('hours'); 
            
            // معدل الاستهلاك القياسي (لتر لكل وحدة قياس)
            $table->decimal('standard_consumption_rate', 10, 2)->default(0);
            
            // نسبة السماح قبل إطلاق تنبيه (مثل 15%)
            $table->decimal('fuel_tolerance_percentage', 5, 2)->default(10.00);
            
            // آخر قراءة عداد مسجلة (للمقارنة التلقائية)
            $table->decimal('last_meter_reading', 15, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropColumn(['fuel_tracking_type', 'standard_consumption_rate', 'fuel_tolerance_percentage', 'last_meter_reading']);
        });
    }
};
