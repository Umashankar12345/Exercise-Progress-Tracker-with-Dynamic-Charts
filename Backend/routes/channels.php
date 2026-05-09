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
