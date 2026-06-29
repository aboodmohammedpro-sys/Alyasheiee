<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. ميزانية المشروع (Project Budgets)
        Schema::create('project_budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects');
            $table->string('category'); // labor (عمالة), material (مواد), equipment (معدات), fuel (وقود), misc (نثريات)
            $table->decimal('estimated_amount', 15, 2); // المبلغ المقدر
            $table->decimal('actual_spent', 15, 2)->default(0); // المبلغ المصرف فعلياً
            $table->timestamps();
        });

        // 2. سجل التكاليف الفعلية (Cost Logs) - لتسجيل كل قرش يُصرف بشكل مفصل
        Schema::create('cost_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects');
            $table->string('source_type'); // disbursement_request, daily_log, fuel_transaction
            $table->uuid('source_id'); // المعرف الخاص بالمصدر
            
            $table->string('category');
            $table->decimal('amount', 15, 2);
            $table->date('transaction_date');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cost_logs');
        Schema::dropIfExists('project_budgets');
    }
};
