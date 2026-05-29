<?php

namespace App\Services\AI;

use App\Models\User;
use App\Models\Workout;
use Illuminate\Support\Carbon;

class MuscleRecoveryService
{
    /**
     * Recovery decay calculation formula based on volume, intensity, and time.
     */
    public function calculateRecovery(
        string $muscle,
        int $volume,
        int $intensity,
        int $hoursSinceWorkout
    ): float {
        // High volume & intensity creates fatigue
        $fatigue = ($volume * 0.05) + ($intensity * 8);

        // Recovery scales with time (roughly 2% per hour)
        $recovery = min(100, $hoursSinceWorkout * 2);

        // Score starts at 100, drops by fatigue, gains by recovery time
        return max(0, min(100, 100 - $fatigue + $recovery));
    }

    /**
     * Compute current recovery scores for all main muscle groups.
     */
    public function getScores(User $user): array
    {
        $muscleGroups = [
            'Chest' => 100.0,
            'Back' => 100.0,
            'Legs' => 100.0,
            'Shoulders' => 100.0,
            'Arms' => 100.0,
            'Core' => 100.0,
        ];

        // Fetch user workouts in the last 72 hours
        $workouts = Workout::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subHours(72))
            ->with(['workoutExercises.workoutSets', 'workoutExercises.exercise'])
            ->get();

        $volumes = [];
        $intensities = [];
        $lastTrained = [];

        foreach ($workouts as $workout) {
            $hoursSince = max(0, $workout->created_at->diffInHours(now()));

            foreach ($workout->workoutExercises as $wExercise) {
                $exercise = $wExercise->exercise;
                if (!$exercise) continue;

                $muscleGroup = $this->normalizeMuscleGroup($exercise->muscle_group);
                
                // Sum volume
                $volume = 0;
                $intensitySum = 0;
                $setsCount = $wExercise->workoutSets->count();

                foreach ($wExercise->workoutSets as $set) {
                    $volume += ($set->weight * $set->reps);
                    // Estimate intensity: higher weight relative to reps represents higher intensity (1-10)
                    $intensitySum += ($set->weight > 0 ? min(10, max(3, $set->weight / 15)) : 5);
                }

                $avgIntensity = $setsCount > 0 ? ($intensitySum / $setsCount) : 5;

                if (!isset($volumes[$muscleGroup])) {
                    $volumes[$muscleGroup] = 0;
                    $intensities[$muscleGroup] = [];
                    $lastTrained[$muscleGroup] = $hoursSince;
                }

                $volumes[$muscleGroup] += $volume;
                $intensities[$muscleGroup][] = $avgIntensity;
                $lastTrained[$muscleGroup] = min($lastTrained[$muscleGroup], $hoursSince);
            }
        }

        // Compute scores
        foreach ($muscleGroups as $muscle => $defaultScore) {
            if (isset($volumes[$muscle])) {
                $volume = $volumes[$muscle];
                $intensity = count($intensities[$muscle]) > 0 ? (int) (array_sum($intensities[$muscle]) / count($intensities[$muscle])) : 5;
                $hoursSince = $lastTrained[$muscle];
                
                $muscleGroups[$muscle] = $this->calculateRecovery($muscle, $volume, $intensity, $hoursSince);
            }
        }

        return $muscleGroups;
    }

    /**
     * Map complex exercise database muscle groups to unified keys.
     */
    private function normalizeMuscleGroup(?string $rawGroup): string
    {
        $raw = strtolower($rawGroup ?? '');

        if (str_contains($raw, 'chest') || str_contains($raw, 'pectoral')) {
            return 'Chest';
        }
        if (str_contains($raw, 'back') || str_contains($raw, 'lats') || str_contains($raw, 'traps') || str_contains($raw, 'rhomboids')) {
            return 'Back';
        }
        if (str_contains($raw, 'leg') || str_contains($raw, 'quad') || str_contains($raw, 'hamstring') || str_contains($raw, 'glute') || str_contains($raw, 'calf') || str_contains($raw, 'thigh')) {
            return 'Legs';
        }
        if (str_contains($raw, 'shoulder') || str_contains($raw, 'deltoid')) {
            return 'Shoulders';
        }
        if (str_contains($raw, 'arm') || str_contains($raw, 'bicep') || str_contains($raw, 'tricep') || str_contains($raw, 'forearm')) {
            return 'Arms';
        }
        return 'Core';
    }
}
