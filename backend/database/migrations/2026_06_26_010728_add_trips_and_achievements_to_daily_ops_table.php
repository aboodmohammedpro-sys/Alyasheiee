<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // النقلات (Trips)
        Schema::create('daily_trips', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('daily_log_id')->constrained('daily_logs')->cascadeOnDelete();
            $table->foreignUuid('equipment_id')->constrained('equipment');
            $table->foreignUuid('material_id')->nullable()->constrained('materials');
            
            $table->string('from_location')->nullable();
            $table->string('to_location')->nullable();
            $table->integer('trip_count')->default(1);
            $table->decimal('quantity', 12, 2)->nullable();
            
            $table->timestamps();
        });

        // الإنجاز اليومي (Achievement)
        Schema::create('daily_achievements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('daily_log_id')->constrained('daily_logs')->cascadeOnDelete();
            
            $table->string('activity_name');
            $table->decimal('quantity', 12, 2);
            $table->string('unit'); // m3, m2, linear meter, etc.
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_achievements');
        Schema::dropIfExists('daily_trips');
    }
};
