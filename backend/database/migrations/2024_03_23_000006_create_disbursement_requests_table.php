<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. طلبات الصرف الرئيسي (Disbursement Requests)
        Schema::create('disbursement_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('request_number')->unique();
            $table->foreignUuid('project_id')->constrained('projects');
            $table->foreignId('requester_id')->constrained('users'); // المراقب
            
            $table->string('type'); // material (مواد), spare_part (قطع غيار), fuel (ديزل), oil (زيت)
            $table->string('status')->default('draft'); // draft, confirmed, approved, issued, rejected
            
            $table->foreignId('confirmed_by')->nullable()->constrained('users'); // كبير المراقبين
            $table->timestamp('confirmed_at')->nullable();
            
            $table->foreignId('approved_by')->nullable()->constrained('users'); // مدير المشروع
            $table->timestamp('approved_at')->nullable();
            
            $table->foreignUuid('warehouse_id')->nullable()->constrained('fuel_tanks'); // أو مستودع مواد عام (سنستخدم fuel_tanks للديزل حالياً وسنعممها لاحقاً)
            
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. بنود طلب الصرف (Items)
        Schema::create('disbursement_request_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('request_id')->constrained('disbursement_requests')->cascadeOnDelete();
            $table->string('item_name');
            $table->decimal('quantity', 12, 2);
            $table->string('unit')->nullable(); // لتر، حبة، جالون
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disbursement_request_items');
        Schema::dropIfExists('disbursement_requests');
    }
};
