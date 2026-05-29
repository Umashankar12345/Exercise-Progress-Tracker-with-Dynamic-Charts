<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutSet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function getDashboardMetrics(): JsonResponse
    {
        $userId = Auth::id();
        $cacheKey = "user_{$userId}_dashboard_metrics";

        // Fetch from Redis cache or calculate raw SQL aggregates if missing
        $data = Cache::remember($cacheKey, now()->addHours(24), function () use ($userId) {
            return [
                'total_volume' => (int) WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                })->where('type', 'strength')->sum(DB::raw('weight * reps')),

                'sessions_count' => (int) DB::table('workouts')->where('user_id', $userId)->count(),

                'muscle_balance' => [
                    'chest' => $this->getMuscleGroupPercentage($userId, 'Chest'),
                    'back'  => $this->getMuscleGroupPercentage($userId, 'Back'),
                    'legs'  => $this->getMuscleGroupPercentage($userId, 'Legs'),
                ]
            ];
        });

        return response()->json($data, 200);
    }

    private function getMuscleGroupPercentage(int $userId, string $group): int
    {
        $total = WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })->count() ?: 1;

        $specific = WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })->whereHas('workoutExercise.exercise', function ($q) use ($group) {
                $q->where('muscle_group', $group);
            })->count();

        return (int) (($specific / $total) * 100);
    }

    /**
     * GET /api/analytics/target-advising?exercise_id={id}
     */
    public function getTargetAdvising(\Illuminate\Http\Request $request): JsonResponse
    {
        $request->validate([
            'exercise_id' => 'required|integer|exists:exercises,id',
        ]);

        $userId     = Auth::id();
        $exerciseId = (int) $request->query('exercise_id');

        $lastWorkoutExercise = \App\Models\WorkoutExercise::where('exercise_id', $exerciseId)
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->orWhereHas('workout', fn($wq) => $wq->where('user_id', $userId));
            })
            ->latest()
            ->first();

        if (!$lastWorkoutExercise) {
            return response()->json([
                'achieved'                => false,
                'message'                 => 'No prior logs found for this exercise. Start logging sets to get progressive overload advice.',
                'recommended_increase_kg' => 0,
                'recommended_weight'      => 0,
            ]);
        }

        $sets = WorkoutSet::where('workout_exercise_id', $lastWorkoutExercise->id)->get();

        if ($sets->isEmpty()) {
            return response()->json([
                'achieved'                => false,
                'message'                 => 'No sets recorded for the last session.',
                'recommended_increase_kg' => 0,
                'recommended_weight'      => 0,
            ]);
        }

        $avgReps   = $sets->avg('reps');
        $maxWeight = $sets->max('weight');
        $setCount  = $sets->count();

        $achieved = ($setCount >= 3 && $avgReps >= 8) || ($setCount >= 2 && $avgReps >= 10);

        if ($achieved) {
            $percentage          = rand(25, 50) / 1000;
            $rawIncrement        = $maxWeight * $percentage;
            $recommendedIncrease = max(2.5, round($rawIncrement / 2.5) * 2.5);
            $recommendedWeight   = $maxWeight + $recommendedIncrease;

            return response()->json([
                'achieved'                => true,
                'message'                 => "Target completed! Suggesting a +" . number_format($recommendedIncrease, 1) . " kg progressive overload increment.",
                'current_max_weight'      => (float) $maxWeight,
                'recommended_increase_kg' => (float) $recommendedIncrease,
                'recommended_weight'      => (float) $recommendedWeight,
                'overload_percentage'     => round($percentage * 100, 1),
            ]);
        }

        return response()->json([
            'achieved'                => false,
            'message'                 => 'Session logged but target rep window not fully complete yet. Focus on hitting 8-12 reps across 3 sets before increasing weight.',
            'current_max_weight'      => (float) $maxWeight,
            'recommended_increase_kg' => 0,
            'recommended_weight'      => (float) $maxWeight,
        ]);
    }
}
