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
        Schema::table('goals', function (Blueprint $table) {
            if (!Schema::hasColumn('goals', 'type')) {
                $table->string('type')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('goals', 'target')) {
                $table->integer('target')->nullable()->after('type');
            }
            if (!Schema::hasColumn('goals', 'progress')) {
                $table->integer('progress')->default(0)->after('target');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('goals', function (Blueprint $table) {
            $table->dropColumn(['type', 'target', 'progress']);
        });
    }
};
