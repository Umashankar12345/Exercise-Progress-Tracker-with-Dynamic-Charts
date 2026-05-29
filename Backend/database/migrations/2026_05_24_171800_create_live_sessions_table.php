<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('room_id');
            $table->string('status')->default('active'); // active, left
            $table->timestamps();
            
            $table->unique(['user_id', 'room_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_sessions');
    }
};
