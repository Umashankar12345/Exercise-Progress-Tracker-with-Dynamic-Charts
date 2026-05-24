<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. AI Sessions
        Schema::create('ai_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // jarvis, insights, vision, recovery
            $table->string('status')->default('active'); // active, closed
            $table->json('metadata')->nullable(); // general session info
            $table->timestamps();
            
            $table->index(['user_id', 'type']);
            $table->index('status');
        });

        // 2. AI Messages (Memory)
        Schema::create('ai_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_session_id')->constrained('ai_sessions')->onDelete('cascade');
            $table->string('role'); // user, assistant, system
            $table->text('content'); // Encrypted text in production
            $table->integer('token_count')->nullable();
            $table->timestamps();

            $table->index('ai_session_id');
        });

        // 3. AI Predictions
        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // plateau, fatigue_forecast, volume_projection, injury_risk
            $table->json('prediction_data');
            $table->decimal('confidence_score', 5, 2)->default(100.00);
            $table->timestamp('target_date')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type']);
        });

        // 4. Pose Estimations (Vision AI)
        Schema::create('pose_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->nullable()->constrained()->onDelete('set null');
            $table->string('exercise_name')->nullable();
            $table->integer('total_reps')->default(0);
            $table->integer('good_reps')->default(0);
            $table->integer('bad_reps')->default(0);
            $table->decimal('avg_angle_deviation', 5, 2)->default(0.00);
            $table->json('feedback_summary')->nullable(); // reps log with specific angles
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        // 5. Fatigue Scores (Recovery AI)
        Schema::create('fatigue_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('cns_fatigue')->default(0); // 0-100 Central Nervous System
            $table->integer('muscular_fatigue')->default(0); // 0-100 Localized fatigue
            $table->integer('cardio_fatigue')->default(0); // 0-100 Cardio fatigue
            $table->integer('aggregate_score')->default(0); // 0-100 overall
            $table->json('breakdown')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        // 6. Recovery Scores (Recovery AI)
        Schema::create('recovery_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('sleep_score')->default(0); // 0-100
            $table->integer('hydration_score')->default(0); // 0-100
            $table->integer('stress_score')->default(0); // 0-100
            $table->integer('aggregate_score')->default(0); // 0-100 overall recovery index
            $table->json('recommendations')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        // 7. Nutrition Plans (Jarvis AI / Meal planning)
        Schema::create('nutrition_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('daily_calories');
            $table->integer('protein_g');
            $table->integer('carbs_g');
            $table->integer('fats_g');
            $table->string('goal_type'); // cutting, bulking, recomp, maintenance
            $table->json('meal_structure')->nullable(); // sample meals
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        // 8. Real-time Telemetry Metrics Cache (Redis Backup)
        Schema::create('realtime_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('metric_type'); // heart_rate, speed, power, pose_landmarks
            $table->json('metric_value');
            $table->timestamp('recorded_at')->useCurrent();

            $table->index(['user_id', 'metric_type', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('realtime_metrics');
        Schema::dropIfExists('nutrition_plans');
        Schema::dropIfExists('recovery_scores');
        Schema::dropIfExists('fatigue_scores');
        Schema::dropIfExists('pose_sessions');
        Schema::dropIfExists('ai_predictions');
        Schema::dropIfExists('ai_messages');
        Schema::dropIfExists('ai_sessions');
    }
};
