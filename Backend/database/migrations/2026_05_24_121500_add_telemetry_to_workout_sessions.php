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
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->text('gps_path')->nullable(); // JSON coordinates
            $table->integer('steps')->default(0);
            $table->integer('cadence')->default(0);
            $table->string('activity_type')->default('idle');
            $table->integer('heart_rate')->default(70);
            $table->text('heart_rate_history')->nullable(); // JSON heart rate points
            $table->string('workout_type')->nullable(); // run, cycle, walk, strength
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->dropColumn([
                'gps_path',
                'steps',
                'cadence',
                'activity_type',
                'heart_rate',
                'heart_rate_history',
                'workout_type',
            ]);
        });
    }
};
