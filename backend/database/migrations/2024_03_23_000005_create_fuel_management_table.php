<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. خزانات الوقود (Tanks)
        Schema::create('fuel_tanks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // مثلاً: خزان الموقع الرئيسي، تانك سيارة الموزع
            $table->string('type')->default('static'); // static (خزان ثابت), mobile (خزان متنقل)
            $table->decimal('capacity', 12, 2); // السعة الكلية باللتر
            $table->decimal('current_balance', 12, 2)->default(0); // الرصيد الحالي
            $table->foreignUuid('project_id')->nullable()->constrained('projects');
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. عمليات الوقود (Transactions)
        Schema::create('fuel_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type'); // receiving (استلام من مورد), transfer (تحويل بين خزانات), dispensing (تعبئة لمعدة)
            
            // الربط بالخزانات
            $table->foreignUuid('from_tank_id')->nullable()->constrained('fuel_tanks');
            $table->foreignUuid('to_tank_id')->nullable()->constrained('fuel_tanks');
            
            // الربط بالمعدات (في حالة الصرف)
            $table->foreignUuid('equipment_id')->nullable()->constrained('equipment');
            $table->foreignUuid('project_id')->nullable()->constrained('projects');
            
            $table->decimal('quantity', 12, 2);
            $table->decimal('odometer_reading', 12, 2)->nullable(); // قراءة عداد المعدة عند التعبئة
            $table->foreignUuid('dispatcher_id')->constrained('users'); // الموزع المسؤول
            
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuel_transactions');
        Schema::dropIfExists('fuel_tanks');
    }
};
