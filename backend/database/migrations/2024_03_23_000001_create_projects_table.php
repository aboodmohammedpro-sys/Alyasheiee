<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('client_name')->nullable();
            $table->string('location')->nullable();
            $table->date('start_date')->nullable();
            $table->date('expected_end_date')->nullable();
            $table->decimal('estimated_budget', 15, 2)->default(0);
            $table->smallInteger('progress_percentage')->default(0);
            $table->string('status')->default('planning');
            $table->text('description')->nullable();
            
            // Audit Columns
            $table->foreignId('created_by')->nullable(); // UUID support comes after user UUID setup
            $table->foreignId('updated_by')->nullable();
            $table->foreignId('deleted_by')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'code']);
        });

        Schema::create('project_phases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('name');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->smallInteger('progress_percentage')->default(0);
            $table->string('status')->default('planning');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_phases');
        Schema::dropIfExists('projects');
    }
};
