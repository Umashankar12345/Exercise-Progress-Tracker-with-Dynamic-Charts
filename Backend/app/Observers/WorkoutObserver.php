<?php

namespace App\Observers;

use App\Events\WorkoutSaved;
use App\Events\StreakUpdated;
use App\Events\GoalProgress;
use App\Events\MuscleBalanceUpdated;
use App\Jobs\AnalyzeWorkoutJob;
use App\Models\Workout;
use Illuminate\Support\Facades\Log;

class WorkoutObserver
{
    public function __construct(private \App\Services\GoalService $goalService) {}

    /**
     * Called automatically after every Workout::create().
     * Fires 4 events immediately + dispatches AI job to queue.
     */
    public function created(Workout $workout): void
    {
        $userId = $workout->user_id;

        Log::info("WorkoutObserver::created — user {$userId}, workout {$workout->id}");

        // ── Event 1: workout.saved ────────────────────────────────────
        WorkoutSaved::dispatch(
            $userId,
            $workout->id,
            $workout->name,
            0,   // sets added separately via WorkoutSetController
            0.0,
            now()->toISOString()
        );

        // ── Event 2: streak.updated ───────────────────────────────────
        $streak = $this->calculateStreak($userId);
        StreakUpdated::dispatch(
            $userId,
            $streak,
            $streak, // simplified — track best separately in production
            now()->toISOString()
        );

        // ── Event 3: muscle.balance.updated ──────────────────────────
        MuscleBalanceUpdated::dispatch(
            $userId,
            $this->getMuscleDistribution($userId),
            'Push/pull imbalance detected'
        );

        // ── Event 4: goal.progress (relevant goals only) ──────────────
        // Get IDs of all exercises logged in this workout
        $exerciseIds = $workout->workoutExercises
            ->pluck('exercise_id')
            ->unique()
            ->values()
            ->toArray();

        // Only check goals relevant to this workout's exercises
        // Avoids touching bench press goal when user only did legs
        $goals = $this->goalService->goalsForWorkout($userId, $exerciseIds);

        foreach ($goals as $goal) {
            $result = $this->goalService->calcPercent($goal, $userId);

            GoalProgress::dispatch(
                $userId,
                $result['goal_id'],
                $result['pct'],
                $result['current_kg'],
                $result['target_kg'],
                $result['exercise_name'],
                $result['status'],
                $result['achieved_at']
            );
        }

        // ── Event 5: insight.ready — dispatched from queue (async) ────
        AnalyzeWorkoutJob::dispatch($userId)
            ->onQueue('default')
            ->delay(now()->addSeconds(3)); // wait 3s so sets can be saved first
    }

    public function updated(Workout $workout): void {}
    public function deleted(Workout $workout): void {}

    // ── Helpers ──────────────────────────────────────────────────────

    private function calculateStreak(int $userId): int
    {
        $dates = Workout::where('user_id', $userId)
            ->selectRaw('DATE(started_at) as day')
            ->groupBy('day')
            ->orderByDesc('day')
            ->pluck('day')
            ->toArray();

        $streak = 0;
        $check  = now()->toDateString();

        foreach ($dates as $day) {
            if ($day === $check) {
                $streak++;
                $check = now()->subDays($streak)->toDateString();
            } else {
                break;
            }
        }

        return $streak;
    }

    private function getMuscleDistribution(int $userId): array
    {
        // Simplified — replace with real muscle group calculation
        return [
            ['name' => 'Chest',     'percentage' => 35],
            ['name' => 'Back',      'percentage' => 20],
            ['name' => 'Legs',      'percentage' => 45],
            ['name' => 'Shoulders', 'percentage' => 25],
            ['name' => 'Arms',      'percentage' => 20],
            ['name' => 'Core',      'percentage' => 15],
        ];
    }
}
