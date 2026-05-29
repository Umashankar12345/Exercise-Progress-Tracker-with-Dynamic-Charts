<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->string('difficulty');
            $table->string('equipment')->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('video_url')->nullable();
            $table->json('muscles')->nullable();
            $table->json('ai_tags')->nullable();
            $table->integer('calories_per_min')->default(5);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
