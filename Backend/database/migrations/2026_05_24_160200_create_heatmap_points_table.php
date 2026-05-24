<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('heatmap_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('workout_session_id')->nullable()->constrained('workout_sessions')->onDelete('cascade');
            $table->double('latitude');
            $table->double('longitude');
            $table->double('speed')->default(0.0);
            $table->integer('heart_rate')->default(72);
            $table->double('calories')->default(0.0);
            $table->integer('steps')->default(0);
            $table->integer('intensity')->default(0); // 0 to 100
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heatmap_points');
    }
};
