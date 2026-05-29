<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Run the migrations. */
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            if (!Schema::hasColumn('exercises', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
            if (!Schema::hasColumn('exercises', 'category')) {
                $table->string('category')->nullable()->after('slug');
            }
            // equipment column
            if (!Schema::hasColumn('exercises', 'equipment')) {
                $table->string('equipment')->nullable()->after('category');
            }
            // difficulty column
            if (!Schema::hasColumn('exercises', 'difficulty')) {
                $table->string('difficulty')->nullable()->after('equipment');
            }
            // description column
            if (!Schema::hasColumn('exercises', 'description')) {
                $table->text('description')->nullable()->after('difficulty');
            }
            // instructions column
            if (!Schema::hasColumn('exercises', 'instructions')) {
                $table->text('instructions')->nullable()->after('description');
            }
            // calories_per_min column
            if (!Schema::hasColumn('exercises', 'calories_per_min')) {
                $table->float('calories_per_min')->default(0)->after('instructions');
            }
            if (!Schema::hasColumn('exercises', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('calories_per_min');
            }
            if (!Schema::hasColumn('exercises', 'video_url')) {
                $table->string('video_url')->nullable()->after('thumbnail');
            }
            // youtube_url column
            if (!Schema::hasColumn('exercises', 'youtube_url')) {
                $table->string('youtube_url')->nullable()->after('video_url');
            }
        });
    }

    /** Reverse the migrations. */
    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'category',
                'equipment',
                'difficulty',
                'description',
                'instructions',
                'calories_per_min',
                'thumbnail',
                'youtube_url',
                'video_url',
            ]);
        });
    }
};
