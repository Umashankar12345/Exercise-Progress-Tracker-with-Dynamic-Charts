<?php

namespace App\Services\AI;

use App\Models\User;
use App\Models\Exercise;

class WorkoutGenerationEngine
{
    public function __construct(
        protected MuscleRecoveryService $recovery
    ) {}

    /**
     * Dynamically generate a workout split targeting recovered muscle groups.
     */
    public function generateWorkout(User $user): array
    {
        $goal = $user->fitness_goal ?? 'Muscle Hypertrophy';
        
        // 1. Fetch muscle recovery indices
        $recoveryScores = $this->recovery->getScores($user);

        // Select muscles with recovery index >= 70
        $availableMuscles = collect($recoveryScores)
            ->filter(fn($score) => $score >= 70)
            ->keys()
            ->toArray();

        if (empty($availableMuscles)) {
            $availableMuscles = ['Arms', 'Core']; // safe fallback
        }

        // 2. Fetch matching exercises from Exercise table
        $workoutExercises = [];
        
        foreach ($availableMuscles as $muscle) {
            $dbExercises = Exercise::where(function($q) use ($muscle) {
                $q->where('muscle_group', 'like', "%{$muscle}%")
                  ->orWhere('name', 'like', "%{$muscle}%");
            })
            ->inRandomOrder()
            ->take(2)
            ->get();

            foreach ($dbExercises as $exercise) {
                $reps = str_contains(strtolower($goal), 'strength') ? '5-8' : '10-12';
                $workoutExercises[] = [
                    'exercise' => $exercise->name,
                    'muscle_group' => $exercise->muscle_group,
                    'sets' => 4,
                    'reps' => $reps,
                ];
            }
        }

        // Standard fallbacks if DB is completely empty of exercises
        if (empty($workoutExercises)) {
            $workoutExercises = [
                ['exercise' => 'Pushups', 'muscle_group' => 'Chest', 'sets' => 3, 'reps' => '15'],
                ['exercise' => 'Bodyweight Squats', 'muscle_group' => 'Legs', 'sets' => 4, 'reps' => '20'],
                ['exercise' => 'Dumbbell Rows', 'muscle_group' => 'Back', 'sets' => 3, 'reps' => '12'],
            ];
        }

        return [
            'split_name' => 'Adaptive Recovery Split: ' . implode('/', array_slice($availableMuscles, 0, 3)),
            'target_muscles' => $availableMuscles,
            'exercises' => $workoutExercises,
            'recovery_snapshot' => $recoveryScores,
            'coach_notes' => 'Ensure a warm-up. Focus on ' . (str_contains(strtolower($goal), 'strength') ? 'explosive concentric speed' : 'eccentric contraction control') . '.',
        ];
    }
}
