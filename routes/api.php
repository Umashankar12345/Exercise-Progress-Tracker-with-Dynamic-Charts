<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkoutController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\GoalController;
use App\Http\Controllers\Api\WorkoutSetController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\ProgressPhotoController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DailyStepController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\HealthMetricController;
use App\Http\Controllers\Api\WorkoutPlanController;
use App\Http\Controllers\Api\MonthlyReportController;
use App\Http\Controllers\Api\SyncController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\RoutineController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\WeightLogController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\WorkoutSessionController;
use App\Http\Controllers\Api\InsightController;
use App\Http\Controllers\Api\SocialInteractionController;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// REAL Hackathon API Routes (Bypassing Sanctum for Demo)
Route::get('/workout-analytics', [WorkoutController::class, 'analytics']);
Route::post('/workouts', [WorkoutController::class, 'store']);
Route::get('/health-dashboard', [HealthController::class, 'dashboard']);
Route::get('/health-analytics', [HealthController::class, 'analytics']);
Route::post('/ai-ask', [AIController::class, 'ask']);

Route::get('/test-exercises', [\App\Http\Controllers\Api\ExerciseLibraryController::class, 'index']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
// Protected Routes
Route::group([], function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Core API Resources
    Route::get('/workouts/heatmap', [WorkoutController::class, 'heatmapData']);
    Route::apiResource('workouts', WorkoutController::class);
    Route::get('/exercises', [\App\Http\Controllers\Api\ExerciseLibraryController::class, 'index']);
    Route::get('/exercises/{id}', [\App\Http\Controllers\Api\ExerciseLibraryController::class, 'show']);
    Route::apiResource('sets', WorkoutSetController::class);
    Route::apiResource('goals', GoalController::class);
    
    // Social Network Routes
    Route::get('/posts', [\App\Http\Controllers\SocialPostController::class, 'index']);
    Route::post('/posts', [\App\Http\Controllers\SocialPostController::class, 'store']);
    Route::post('/posts/{id}/like', [\App\Http\Controllers\SocialPostController::class, 'toggleLike']);
    Route::post('/posts/{id}/comments', [\App\Http\Controllers\SocialPostController::class, 'storeComment']);
    
    // Step Tracking
    Route::get('/daily-steps', [DailyStepController::class, 'index']);
    Route::post('/daily-steps', [DailyStepController::class, 'store']);
    Route::post('/wearables/google-fit', [\App\Http\Controllers\Api\WearableController::class, 'store']);

    // Health & Body Metrics
    Route::get('/body-metrics', [HealthMetricController::class, 'index']);
    Route::post('/body-metrics', [HealthMetricController::class, 'store']);
    Route::get('/health-plan', [HealthMetricController::class, 'getPlan']);

    // Weight Logs
    Route::get('/weight-logs', [WeightLogController::class, 'index']);
    Route::post('/weight-logs', [WeightLogController::class, 'store']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Workout Plan
    Route::get('/workout-plan', [WorkoutPlanController::class, 'getPlan']);
    Route::post('/workout-plan/generate', [WorkoutPlanController::class, 'regeneratePlan']);

    Route::get('/user/streak', [UserController::class, 'streak']);
    Route::get('/user/dna', [UserController::class, 'dna']);
    Route::get('/prs', [WorkoutController::class, 'prs']);

    // Progress & AI & Export
    Route::get('/progress/summary', [ProgressController::class, 'summary']);
    Route::get('/progress/chart', [ProgressController::class, 'chart']);
    Route::get('/progress/muscles', [ProgressController::class, 'muscles']);
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/progress/{snapshot}/photo', [ProgressPhotoController::class, 'store']);
    
    // AI Insights (Stored in Database)
    Route::get('/insights', [\App\Http\Controllers\Api\AIInsightController::class, 'index']);
    Route::get('/insights/unread-count', [\App\Http\Controllers\Api\AIInsightController::class, 'unreadCount']);
    Route::post('/insights/{id}/read', [\App\Http\Controllers\Api\AIInsightController::class, 'markRead']);
    Route::post('/insights/read-all', [\App\Http\Controllers\Api\AIInsightController::class, 'markAllRead']);
    Route::post('/ai/insights/generate', [\App\Http\Controllers\Api\AIInsightController::class, 'generate']);
    
    Route::get('/ai/insights', [AIController::class, 'insights']);
    Route::post('/ai/chat', [\App\Http\Controllers\Api\AI\JarvisController::class, 'chat']);
    Route::post('/ai-coach', [\App\Http\Controllers\Api\AI\JarvisController::class, 'chat']);

    // Separate FitTrack AI Core Systems
    Route::prefix('ai')->middleware('throttle:ai')->group(function () {
        // 1. Jarvis AI
        Route::prefix('jarvis')->group(function () {
            Route::post('chat', [\App\Http\Controllers\Api\AI\JarvisController::class, 'chat']);
            Route::post('workout', [\App\Http\Controllers\Api\AI\JarvisController::class, 'generateWorkout']);
            Route::post('nutrition', [\App\Http\Controllers\Api\AI\JarvisController::class, 'generateNutrition']);
        });

        // 2. AI Insights
        Route::prefix('insights')->group(function () {
            Route::post('analyze', [\App\Http\Controllers\Api\AI\InsightsController::class, 'analyze']);
                    Route::get('plateaus', [\App\Http\Controllers\Api\AI\InsightsController::class, 'getPlateauPredictions']);
        Route::get('/', [\App\Http\Controllers\Api\AI\InsightsController::class, 'getInsights']);
        Route::post('/{id}/read', [\App\Http\Controllers\Api\AI\InsightsController::class, 'markInsightRead']);
        Route::post('/read-all', [\App\Http\Controllers\Api\AI\InsightsController::class, 'markAllInsightsRead']);
        });

        // 3. Vision AI
        Route::prefix('vision')->group(function () {
            Route::post('pose', [\App\Http\Controllers\Api\AI\VisionController::class, 'logPoseSession']);
            Route::get('pose/{sessionId}/report', [\App\Http\Controllers\Api\AI\VisionController::class, 'getPoseReport']);
            
            // Fix pack aliases
            Route::post('log', [\App\Http\Controllers\Api\AI\VisionController::class, 'logPoseSession']);
            Route::get('report/{id}', [\App\Http\Controllers\Api\AI\VisionController::class, 'getPoseReport']);

            // Streaming joint coordinate updates
            Route::post('pose/stream', [\App\Http\Controllers\Api\AI\VisionController::class, 'streamPose']);
        });

        // 4. Recovery AI
        Route::prefix('recovery')->group(function () {
            Route::post('calculate', [\App\Http\Controllers\Api\AI\RecoveryController::class, 'calculateRecovery']);
            Route::get('logs', [\App\Http\Controllers\Api\AI\RecoveryController::class, 'getRecoveryLogs']);
        });
    });

    Route::get('/workouts/{workout}/export', [ExportController::class, 'exportWorkout']);
    Route::match(['get', 'post'], '/reports/monthly', [MonthlyReportController::class, 'getReport']);

    // Additions: Offline Sync, Ghost Placeholder, Target Advising, Routines Reorder
    Route::get('/exercises/{id}', function ($id) {
    return App\Models\Exercise::findOrFail($id);
});
    Route::get('/exercises/{id}/ghost-placeholder', [ExerciseController::class, 'getGhostPlaceholder']);
    Route::get('/exercises/{id}/video-embed', [ExerciseController::class, 'getVideoEmbed']);
    Route::post('/workouts/bulk-sync', [SyncController::class, 'bulkSync']);
    Route::get('/analytics/target-advising', [AnalyticsController::class, 'getTargetAdvising']);
    Route::apiResource('routines', RoutineController::class);
    Route::put('/routines/reorder', [RoutineController::class, 'reorder']);
    Route::put('/workout-plan/reorder', [WorkoutPlanController::class, 'reorder']);

    // Dashboard summary — Cached for high-speed performance
    Route::get('/dashboard/summary', [AnalyticsController::class, 'getDashboardMetrics']);
    Route::get('/dashboard/analytics', [AnalyticsController::class, 'analytics']);

    // Workout Session Engine
    Route::post('/workout-session/start', [WorkoutSessionController::class, 'start']);
    Route::post('/workout-session/{id}/log-set', [WorkoutSessionController::class, 'logSet']);
    Route::post('/workout-session/{id}/finish', [WorkoutSessionController::class, 'finish']);
    Route::post('/workout-session/reps', [WorkoutSessionController::class, 'updateReps']);

    // Telemetry and GPS tracking routes
    Route::post('/gps', [WorkoutSessionController::class, 'updateGps']);
    Route::post('/steps', [WorkoutSessionController::class, 'updateSteps']);
    Route::post('/workout', [WorkoutSessionController::class, 'updateWorkoutStatus']);
    Route::post('/activity', [WorkoutSessionController::class, 'updateActivity']);
    Route::post('/heart-rate', [WorkoutSessionController::class, 'updateHeartRate']);

    // Quick Insights
    Route::get('/insights/quick', [InsightController::class, 'insights']);

    // Social Interactions
    Route::post('/connections/connect', [SocialInteractionController::class, 'connectUser']);
    Route::get('/connections', [SocialInteractionController::class, 'getConnections']);
    Route::post('/workouts/import', [SocialInteractionController::class, 'importWorkout']);
    Route::post('/challenges/{id}/join', [SocialInteractionController::class, 'joinChallenge']);
    Route::get('/challenges/active', [SocialInteractionController::class, 'getActiveChallenges']);
    Route::get('/leaderboard', [SocialInteractionController::class, 'getLeaderboard']);
    Route::post('/live-sessions/join', [SocialInteractionController::class, 'joinLiveSession']);
    Route::post('/live-sessions/leave', [SocialInteractionController::class, 'leaveLiveSession']);
    Route::get('/live-sessions/{roomId}/participants', [SocialInteractionController::class, 'getLiveSessionParticipants']);
});


