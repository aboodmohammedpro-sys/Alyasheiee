<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // السجل اليومي الأساسي
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('recorder_id')->constrained('users');
            $table->foreignId('approver_id')->nullable()->constrained('users');
            
            $table->date('date');
            $table->string('status')->default('draft'); // draft, submitted, approved
            $table->text('general_notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['project_id', 'date']); // منع تكرار السجل لنفس المشروع في نفس اليوم
        });

        // حضور العمال
        Schema::create('labor_attendance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('daily_log_id')->constrained('daily_logs')->cascadeOnDelete();
            $table->foreignUuid('employee_id')->constrained('employees');
            
            $table->decimal('hours', 4, 2)->default(8.00);
            $table->decimal('overtime', 4, 2)->default(0.00);
            $table->string('status')->default('present'); // present, absent, leave
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });

        // استخدام المعدات
        Schema::create('equipment_usage', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('daily_log_id')->constrained('daily_logs')->cascadeOnDelete();
            $table->foreignUuid('equipment_id')->constrained('equipment');
            
            $table->decimal('start_meter', 12, 2)->nullable();
            $table->decimal('end_meter', 12, 2)->nullable();
            $table->decimal('work_hours', 4, 2)->nullable();
            $table->string('status')->default('working'); // working, standby, breakdown
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment_usage');
        Schema::dropIfExists('labor_attendance');
        Schema::dropIfExists('daily_logs');
    }
};
