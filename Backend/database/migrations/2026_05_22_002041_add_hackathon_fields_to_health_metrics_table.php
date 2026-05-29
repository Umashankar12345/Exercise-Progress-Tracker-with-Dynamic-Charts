<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('health_metrics', function (Blueprint $table) {
            $table->integer('heart_rate')->nullable();
            $table->float('water_intake')->nullable();
            $table->integer('steps')->nullable();
            $table->integer('sleep_hours')->nullable();
            $table->integer('stress_level')->nullable();

            // Make existing fields nullable to avoid NOT NULL constraint errors
            $table->decimal('height')->nullable()->change();
            $table->decimal('weight')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('health_metrics', function (Blueprint $table) {
            $table->dropColumn(['heart_rate', 'water_intake', 'steps', 'sleep_hours', 'stress_level']);
            $table->decimal('height')->nullable(false)->change();
            $table->decimal('weight')->nullable(false)->change();
        });
    }
};
