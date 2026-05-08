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
    Route::apiResource('exercises', ExerciseController::class);
    Route::apiResource('sets', WorkoutSetController::class);
    Route::apiResource('goals', GoalController::class);

    // Progress & AI & Export
    Route::get('/progress/summary', [ProgressController::class, 'summary']);
    Route::get('/progress/chart', [ProgressController::class, 'chart']);
    Route::get('/progress/muscles', [ProgressController::class, 'muscles']);
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/progress/{snapshot}/photo', [ProgressPhotoController::class, 'store']);
    Route::get('/ai/insights', [AIController::class, 'insights']);
    Route::get('/workouts/{workout}/export', [ExportController::class, 'exportWorkout']);
});
