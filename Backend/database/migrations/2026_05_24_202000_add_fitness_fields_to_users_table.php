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
        Schema::table('users', function (Blueprint $table) {
            $table->string('fitness_goal')->nullable()->after('avatar_url');
            $table->string('experience_level')->nullable()->after('fitness_goal');
            $table->decimal('weight', 5, 2)->nullable()->after('experience_level');
            $table->decimal('height', 5, 2)->nullable()->after('weight');
            $table->json('injuries')->nullable()->after('height');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['fitness_goal', 'experience_level', 'weight', 'height', 'injuries']);
        });
    }
};
