<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('activity_type');
            $table->integer('points')->default(0);
            $table->integer('duration')->default(0); // in seconds
            $table->integer('steps')->default(0);
            $table->double('distance')->default(0.0);
            $table->double('calories')->default(0.0);
            $table->float('intensity')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_points');
    }
};
