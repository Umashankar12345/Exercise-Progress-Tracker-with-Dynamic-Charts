<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')
                  ->constrained()->cascadeOnDelete();
            $table->decimal('target_kg',   6, 2);
            $table->date('target_date');
            $table->timestamp('achieved_at')->nullable();  // null = not yet achieved
            $table->timestamps();

            // One goal per exercise per user — no duplicate goals
            $table->unique(['user_id', 'exercise_id']);

            // Fast lookup in GoalService::goalsForWorkout()
            $table->index(['user_id', 'exercise_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
