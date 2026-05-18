<?php

namespace App\Observers;

use App\Models\WorkoutSet;
use App\Models\ProgressSnapshot;
use App\Events\PrAchieved;
use App\Services\WorkoutService;
use Illuminate\Support\Facades\Log;

class WorkoutSetObserver
{
    protected $workoutService;

    public function __construct(WorkoutService $workoutService)
    {
        $this->workoutService = $workoutService;
    }

    /**
     * Handle the WorkoutSet "created" event.
     */
    public function created(WorkoutSet $workoutSet): void
    {
        $this->recalculateVolumeAndCheckPR($workoutSet, true);
    }

    /**
     * Handle the WorkoutSet "updated" event.
     */
    public function updated(WorkoutSet $workoutSet): void
    {
        $this->recalculateVolumeAndCheckPR($workoutSet, false);
    }

    /**
     * Handle the WorkoutSet "deleted" event.
     */
    public function deleted(WorkoutSet $workoutSet): void
    {
        $this->recalculateVolumeAndCheckPR($workoutSet, false);
    }

    /**
     * Recalculate volume for ProgressSnapshots and check if a new PR is achieved.
     */
    protected function recalculateVolumeAndCheckPR(WorkoutSet $workoutSet, bool $checkPR): void
    {
        // 1. Fetch relations
        $workoutExercise = $workoutSet->workoutExercise;
        if (!$workoutExercise) {
            return;
        }

        $workout = $workoutExercise->workout;
        if (!$workout) {
            return;
        }

        $userId = $workout->user_id;
        $date = $workout->started_at->toDateString();

        Log::info("WorkoutSetObserver::recalculateVolumeAndCheckPR — User {$userId}, Workout {$workout->id}, Date {$date}");

        // 2. Recalculate total volume of all workouts logged by this user on this specific date
        $totalVolume = WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($userId, $date) {
            $q->where('user_id', $userId)
              ->whereDate('started_at', $date);
        })->get()->sum(function ($set) {
            return $set->reps * $set->weight;
        });

        $workoutsCount = \App\Models\Workout::where('user_id', $userId)
            ->whereDate('started_at', $date)
            ->count();

        // 3. Update or create the ProgressSnapshot
        $snapshot = ProgressSnapshot::updateOrCreate(
            ['user_id' => $userId, 'date' => $date],
            [
                'total_volume' => $totalVolume,
                'workouts_count' => $workoutsCount ?: 1,
            ]
        );

        Log::info("ProgressSnapshot updated for User {$userId} on Date {$date}: Volume = {$totalVolume}, Workouts = {$workoutsCount}");

        // 4. PR Detection (only on set creation if requested)
        if ($checkPR) {
            $exercise = $workoutExercise->exercise;
            if (!$exercise) {
                return;
            }

            // Find the maximum weight previously completed by the user for this exercise
            $previousMaxWeight = WorkoutSet::where('id', '!=', $workoutSet->id)
                ->whereHas('workoutExercise', function ($q) use ($exercise, $userId) {
                    $q->where('exercise_id', $exercise->id)
                      ->whereHas('workout', function ($q2) use ($userId) {
                          $q2->where('user_id', $userId);
                      });
                })->max('weight');

            $currentWeight = $workoutSet->weight;

            // Trigger PR Event if this is the first set, or weight is strictly higher than previous max
            if (is_null($previousMaxWeight) || $currentWeight > $previousMaxWeight) {
                Log::info("New PR detected for User {$userId} on Exercise '{$exercise->name}': New = {$currentWeight}, Old = " . ($previousMaxWeight ?? 0));

                PrAchieved::dispatch(
                    $userId,
                    $exercise->name,
                    (float)$currentWeight,
                    (float)($previousMaxWeight ?? 0),
                    now()->toIso8601String()
                );
            }
        }
    }
}
