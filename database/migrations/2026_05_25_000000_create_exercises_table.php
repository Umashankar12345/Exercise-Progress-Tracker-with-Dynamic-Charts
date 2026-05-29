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
        Schema::dropIfExists('exercises');
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->nullable()->after('name');
            $table->string('category')->nullable()->after('slug');
            $table->string('equipment')->nullable()->after('category');
            $table->string('muscle_group');
            $table->text('description')->nullable()->after('muscle_group');
            $table->text('instructions')->nullable()->after('description');
            $table->float('calories_per_min')->default(0)->after('instructions');
            $table->string('thumbnail')->nullable()->after('calories_per_min');
            $table->string('video_url')->nullable()->after('thumbnail');
            $table->string('youtube_url')->nullable()->after('video_url');
            $table->string('difficulty')->nullable()->after('equipment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
