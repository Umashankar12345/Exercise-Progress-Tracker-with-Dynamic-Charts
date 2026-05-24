<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('exercise_name')->nullable();
            $table->integer('reps')->default(0);
            $table->integer('steps')->default(0);
            $table->double('calories')->default(0.0);
            $table->double('distance')->default(0.0);
            $table->integer('duration')->default(0); // in seconds
            $table->integer('avg_heart_rate')->default(0);
            $table->string('intensity')->default('low');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_logs');
    }
};
