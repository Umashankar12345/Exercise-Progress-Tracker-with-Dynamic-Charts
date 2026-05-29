<?php

namespace App\Services;

use App\Models\Workout;

class WorkoutService
{
    /**
     * Calculate the total volume for a given workout.
     */
    public function calculateVolume(Workout $workout): float
    {
        $volume = 0;
        foreach ($workout->workoutExercises as $workoutExercise) {
            foreach ($workoutExercise->workoutSets as $set) {
                $volume += ($set->reps * $set->weight);
            }
        }
        return $volume;
    }

    /**
     * Estimate 1RM (One Rep Max) using the Epley formula: 1RM = weight * (1 + 0.0333 * reps).
     */
    public function estimate1RM(float $weight, int $reps): float
    {
        if ($reps <= 1) {
            return $weight;
        }
        return $weight * (1 + 0.0333 * $reps);
    }
}
