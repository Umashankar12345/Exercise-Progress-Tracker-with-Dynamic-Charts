<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->string('category')->nullable();
            $table->string('difficulty')->nullable();
            $table->string('youtube_url')->nullable();
            $table->text('instructions')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn(['category', 'difficulty', 'youtube_url', 'instructions']);
        });
    }
};
