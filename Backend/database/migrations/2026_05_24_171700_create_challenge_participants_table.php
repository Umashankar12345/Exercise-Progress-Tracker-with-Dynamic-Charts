<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
            $table->integer('progress')->default(0);
            $table->string('status')->default('joined'); // joined, completed
            $table->timestamps();

            $table->unique(['user_id', 'challenge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_participants');
    }
};
