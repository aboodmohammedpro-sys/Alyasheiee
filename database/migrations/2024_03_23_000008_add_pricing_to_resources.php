<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->decimal('hourly_rate', 10, 2)->default(0)->after('status');
        });

        Schema::table('equipment', function (Blueprint $table) {
            $table->decimal('hourly_rate', 10, 2)->default(0)->after('status');
        });
        
        Schema::table('materials', function (Blueprint $table) {
            $table->decimal('unit_price', 10, 2)->default(0)->after('unit');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) { $table->dropColumn('hourly_rate'); });
        Schema::table('equipment', function (Blueprint $table) { $table->dropColumn('hourly_rate'); });
        Schema::table('materials', function (Blueprint $table) { $table->dropColumn('unit_price'); });
    }
};
