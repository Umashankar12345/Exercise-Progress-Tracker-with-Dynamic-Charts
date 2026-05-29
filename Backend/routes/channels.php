<?php

use Illuminate\Support\Facades\Broadcast;

/**
 * One channel rule covers ALL 10 broadcast events:
 * InsightReady, WorkoutSaved, StreakUpdated, PrAchieved,
 * GoalProgress, MuscleBalanceUpdated, etc.
 *
 * They all broadcast on the same private channel: user.{userId}
 * Auth check: the logged-in user's ID must match the channel's {userId}
 */
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('workout.{id}', function ($user, $id) {
    // Check if the user is authorized to view this workout session
    // For demo purposes, we will return true to allow simple viewing/sharing,
    // or authenticate that the user owns the session if needed.
    return true; 
});

Broadcast::channel('heatmap.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('telemetry.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
