<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('disbursement_request_items', function (Blueprint $table) {
            $table->foreignUuid('material_id')
                ->nullable()
                ->after('request_id')
                ->constrained('materials')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('disbursement_request_items', function (Blueprint $table) {
            $table->dropForeign(['material_id']);
            $table->dropColumn('material_id');
        });
    }
};
