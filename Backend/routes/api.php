<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WorkoutController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\WorkoutSetController;

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

    // Progress & AI
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::get('/ai/insights', [ProgressController::class, 'insights']);
});
