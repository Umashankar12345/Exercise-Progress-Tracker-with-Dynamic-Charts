<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('connected_user_id')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('connected'); // pending, connected
            $table->timestamps();
            
            $table->unique(['user_id', 'connected_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_connections');
    }
};
