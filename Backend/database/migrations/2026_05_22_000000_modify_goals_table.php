<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('goals', function (Blueprint $table) {
            if (!Schema::hasColumn('goals', 'title')) {
                $table->string('title')->nullable()->after('exercise_id');
            }
            if (!Schema::hasColumn('goals', 'target_value')) {
                $table->decimal('target_value', 8, 2)->nullable()->after('target_kg');
            }
            if (!Schema::hasColumn('goals', 'current_value')) {
                $table->decimal('current_value', 8, 2)->default(0)->after('target_value');
            }
        });
    }

    public function down(): void
    {
        Schema::table('goals', function (Blueprint $table) {
            $table->dropColumn(['title', 'target_value', 'current_value']);
        });
    }
};
