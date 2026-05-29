<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a composite index on workout_sets(workout_exercise_id, weight, reps).
     *
     * The DashboardController's raw SQL tonnage query joins workout_sets
     * filtering by type and ordering by these columns — this index ensures
     * the GROUP BY aggregation scans the index rather than the full table.
     */
    public function up(): void
    {
        Schema::table('workout_sets', function (Blueprint $table) {
            // Composite covering index: accelerates SUM(weight * reps) GROUP BY queries
            $table->index(
                ['workout_exercise_id', 'weight', 'reps'],
                'idx_workout_sets_exercise_weight_reps'
            );

            // Partial-type index helper — type column already added in prior migration
            // Adding a standalone index on type for fast WHERE type = 'strength' scans
            $table->index('type', 'idx_workout_sets_type');
        });
    }

    public function down(): void
    {
        Schema::table('workout_sets', function (Blueprint $table) {
            $table->dropIndex('idx_workout_sets_exercise_weight_reps');
            $table->dropIndex('idx_workout_sets_type');
        });
    }
};
