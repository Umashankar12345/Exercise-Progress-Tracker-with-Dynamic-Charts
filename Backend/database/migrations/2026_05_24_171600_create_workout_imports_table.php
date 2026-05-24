<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('workout_plan_id')->nullable()->constrained('workout_plans')->onDelete('set null');
            $table->string('split_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_imports');
    }
};
