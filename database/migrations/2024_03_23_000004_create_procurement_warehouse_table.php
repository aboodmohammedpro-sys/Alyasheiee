<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // الموردون
        Schema::create('suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });

        // المواد / الأصناف
        Schema::create('materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('category'); // Construction materials, Spare parts, etc.
            $table->string('unit'); // m3, kg, piece, etc.
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // المستودعات
        Schema::create('warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('type')->default('site'); // central, site
            $table->foreignUuid('project_id')->nullable()->constrained('projects');
            $table->timestamps();
            $table->softDeletes();
        });

        // طلبات الشراء
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects');
            $table->foreignUuid('requester_id')->constrained('users');
            $table->string('status')->default('draft'); // draft, submitted, approved, rejected, ordered
            $table->date('required_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // بنود طلب الشراء
        Schema::create('purchase_request_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('purchase_request_id')->constrained('purchase_requests')->cascadeOnDelete();
            $table->foreignUuid('material_id')->constrained('materials');
            $table->decimal('quantity', 12, 2);
            $table->decimal('estimated_unit_price', 12, 2)->nullable();
            $table->timestamps();
        });

        // رصيد المخزون
        Schema::create('inventory_stocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignUuid('material_id')->constrained('materials')->cascadeOnDelete();
            $table->decimal('quantity', 12, 2)->default(0);
            $table->timestamps();

            $table->unique(['warehouse_id', 'material_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_stocks');
        Schema::dropIfExists('purchase_request_items');
        Schema::dropIfExists('purchase_requests');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('suppliers');
    }
};
