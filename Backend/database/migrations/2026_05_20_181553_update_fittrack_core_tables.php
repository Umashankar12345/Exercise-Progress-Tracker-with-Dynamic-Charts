<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Upgrade workout_sets to handle cardio metric tracking
        Schema::table('workout_sets', function (Blueprint $table) {
            $table->decimal('distance', 8, 2)->nullable()->after('reps');
            $table->integer('duration_seconds')->nullable()->after('distance');
            $table->string('type')->default('strength')->after('duration_seconds'); // 'strength' or 'cardio'
        });

        // 2. Create the clean workout_routines master sequencing table
        Schema::create('workout_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('focus')->nullable();
            $table->integer('sequence_order')->default(0);
            $table->timestamps();
        });

        // 3. Add optimization columns and indexing to workout_exercises
        Schema::table('workout_exercises', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->index(['user_id', 'exercise_id', 'created_at'], 'idx_user_exercise_history');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_routines');
        Schema::table('workout_sets', function (Blueprint $table) {
            $table->dropColumn(['distance', 'duration_seconds', 'type']);
        });
        Schema::table('workout_exercises', function (Blueprint $table) {
            $table->dropIndex('idx_user_exercise_history');
            $table->dropColumn('user_id');
        });
    }
};
