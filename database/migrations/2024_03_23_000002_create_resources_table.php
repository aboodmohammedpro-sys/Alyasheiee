<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('position');
            $table->string('department')->nullable();
            $table->string('phone')->nullable();
            $table->string('status')->default('active'); // active, on_leave, terminated
            $table->date('joining_date')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'code']);
        });

        Schema::create('equipment', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type'); // Excavator, Truck, etc.
            $table->string('serial_number')->nullable();
            $table->string('brand')->nullable();
            $table->string('status')->default('available'); // available, working, maintenance
            $table->date('purchase_date')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'code', 'type']);
        });

        Schema::create('project_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            
            // Polymorphic relation to resource (Employee or Equipment)
            $table->uuid('assignable_id');
            $table->string('assignable_type');
            
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status')->default('active');
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['assignable_id', 'assignable_type'], 'resource_assignment_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_assignments');
        Schema::dropIfExists('equipment');
        Schema::dropIfExists('employees');
    }
};
