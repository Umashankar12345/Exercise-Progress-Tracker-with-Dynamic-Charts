<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('workout_session_id')->nullable()->constrained('workout_sessions')->onDelete('cascade');
            $table->string('exercise_name');
            $table->integer('reps')->default(0);
            $table->integer('duration')->default(0); // in seconds
            $table->string('intensity')->default('medium');
            $table->double('calories_burned')->default(0.0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_sessions');
    }
};
