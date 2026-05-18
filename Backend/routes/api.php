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
use App\Http\Controllers\Api\BodyMetricController;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Core API Resources
    Route::apiResource('workouts', WorkoutController::class);
    Route::get('/exercises', [\App\Http\Controllers\Api\ExerciseLibraryController::class, 'index']);
    Route::get('/exercises/{id}', [\App\Http\Controllers\Api\ExerciseLibraryController::class, 'show']);
    Route::apiResource('sets', WorkoutSetController::class);
    Route::apiResource('goals', GoalController::class);
    
    // Step Tracking
    Route::get('/daily-steps', [DailyStepController::class, 'index']);
    Route::post('/daily-steps', [DailyStepController::class, 'store']);

    // Health & Body Metrics
    Route::get('/body-metrics', [BodyMetricController::class, 'index']);
    Route::post('/body-metrics', [BodyMetricController::class, 'store']);
    Route::get('/health-plan', [BodyMetricController::class, 'getPlan']);

    Route::get('/user/streak', [UserController::class, 'streak']);
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
    
    Route::get('/ai/insights', [AIController::class, 'insights']);
    Route::post('/ai/chat', [AIController::class, 'chat']);
    Route::get('/workouts/{workout}/export', [ExportController::class, 'exportWorkout']);
});
