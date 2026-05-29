<?php

namespace App\Services;

use App\Models\Goal;
use App\Models\WorkoutSet;
use Illuminate\Support\Collection;

class GoalService
{
    /**
     * Calculate completion % for a single goal after a workout is saved.
     * Called by WorkoutObserver for every active goal that matches
     * the exercises just logged.
     *
     * Returns an array ready to pass straight into GoalProgress::dispatch().
     */
    public function calcPercent(Goal $goal, int $userId): array
    {
        // Get the user's best (max) weight for this exercise — ever
        $currentKg = $this->bestWeight($userId, $goal->exercise_id);

        // Clamp to 100 — user may have exceeded the target (overachieved)
        $pct = $goal->target_kg > 0
            ? min(round(($currentKg / $goal->target_kg) * 100, 1), 100.0)
            : 0.0;

        $status     = $this->resolveStatus($goal, $pct);
        $achievedAt = null;

        // Mark goal achieved if just crossed 100% for the first time
        if ($pct >= 100.0 && is_null($goal->achieved_at)) {
            $goal->update(['achieved_at' => now()]);
            $achievedAt = now()->toISOString();
        }

        return [
            'goal_id'       => $goal->id,
            'pct'           => $pct,
            'current_kg'    => $currentKg,
            'target_kg'     => $goal->target_kg,
            'exercise_name' => $goal->exercise->name ?? 'Unknown',
            'status'        => $status,
            'achieved_at'   => $achievedAt,
            'target_date'   => $goal->target_date,
            'created_at'    => $goal->created_at->toISOString(),
        ];
    }

    /**
     * Recalculate ALL active goals for a user.
     * Used by GoalController to serve the REST endpoint on page load.
     */
    public function allGoalsProgress(int $userId): Collection
    {
        return Goal::with('exercise')
            ->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->whereNull('achieved_at');          // only active goals
            })
            ->orWhere(function ($q) use ($userId) {
                // include recently achieved (last 7 days) for celebration UI
                $q->where('user_id', $userId)
                  ->where('achieved_at', '>=', now()->subDays(7));
            })
            ->get()
            ->map(fn(Goal $goal) => $this->calcPercent($goal, $userId));
    }

    /**
     * Find only goals that are relevant to the exercises
     * just logged in this workout — avoids recalculating every goal.
     */
    public function goalsForWorkout(int $userId, array $exerciseIds): Collection
    {
        return Goal::with('exercise')
            ->where('user_id', $userId)
            ->whereIn('exercise_id', $exerciseIds)
            ->whereNull('achieved_at')
            ->get();
    }

    // ─────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────

    /**
     * Best weight the user has ever lifted for this exercise.
     * This is the "current" value compared against the goal target.
     */
    private function bestWeight(int $userId, int $exerciseId): float
    {
        return (float) WorkoutSet::whereHas('workoutExercise', function ($q) use ($userId, $exerciseId) {
                $q->where('exercise_id', $exerciseId)
                  ->whereHas('workout', fn($wq) => $wq->where('user_id', $userId));
            })
            ->max('weight') ?? 0.0;
    }

    /**
     * Determine goal status string.
     * - 'achieved'    → pct >= 100
     * - 'overdue'     → past target_date and pct < 100
     * - 'at_risk'     → within 14 days of target_date and pct < 50
     * - 'in_progress' → everything else
     */
    private function resolveStatus(Goal $goal, float $pct): string
    {
        if ($pct >= 100.0) {
            return 'achieved';
        }

        if (!$goal->target_date) {
            return 'in_progress';
        }

        $daysLeft = now()->diffInDays($goal->target_date, false);

        if ($daysLeft < 0) {
            return 'overdue';     // past deadline, not yet hit
        }

        if ($daysLeft <= 14 && $pct < 50.0) {
            return 'at_risk';     // 2 weeks left, less than halfway
        }

        return 'in_progress';
    }
}
