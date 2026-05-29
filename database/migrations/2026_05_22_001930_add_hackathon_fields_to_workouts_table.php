<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workouts', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->integer('duration')->nullable();
            $table->integer('calories_burned')->nullable();
            $table->integer('reps')->default(0);
            $table->string('type')->nullable();
            // Make name nullable if we are replacing it
            $table->string('name')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('workouts', function (Blueprint $table) {
            $table->dropColumn(['title', 'duration', 'calories_burned', 'reps', 'type']);
            $table->string('name')->nullable(false)->change();
        });
    }
};
