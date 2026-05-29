<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workout;
use App\Models\HealthMetric;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InsightController extends Controller
{
    public function insights(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?: $request->user();
        $userId = $user ? $user->id : 1;

        // 1. Fetch workouts and analyze muscle groups
        $last7DaysWorkouts = Workout::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(7)->startOfDay())
            ->with('workoutExercises.exercise')
            ->get();

        $muscleGroups = [];
        $totalWorkoutsThisWeek = $last7DaysWorkouts->count();

        foreach ($last7DaysWorkouts as $w) {
            foreach ($w->workoutExercises as $we) {
                if ($we->exercise) {
                    $muscle = $we->exercise->muscle_group;
                    // Deduce/sanitize muscle group if unknown or empty
                    if (!$muscle || strtolower($muscle) === 'unknown') {
                        $name = strtolower($we->exercise->name);
                        if (str_contains($name, 'bench') || str_contains($name, 'chest') || str_contains($name, 'push-up') || str_contains($name, 'pushup') || str_contains($name, 'dip')) {
                            $muscle = 'Chest';
                        } elseif (str_contains($name, 'squat') || str_contains($name, 'leg') || str_contains($name, 'lunge') || str_contains($name, 'deadlift')) {
                            $muscle = 'Legs';
                        } elseif (str_contains($name, 'pull-up') || str_contains($name, 'pullup') || str_contains($name, 'row') || str_contains($name, 'back')) {
                            $muscle = 'Back';
                        } elseif (str_contains($name, 'press') || str_contains($name, 'shoulder')) {
                            $muscle = 'Shoulders';
                        } else {
                            $muscle = 'Full Body';
                        }
                    }
                    $muscleGroups[$muscle] = ($muscleGroups[$muscle] ?? 0) + 1;
                }
            }
        }

        arsort($muscleGroups);

        $insights = [];

        // Insight A: Muscle Specific Frequency
        if (!empty($muscleGroups)) {
            $topMuscle = key($muscleGroups);
            $topCount = current($muscleGroups);
            $insights[] = "You trained {$topMuscle} {$topCount}x this week. Keep monitoring local volume progression.";
        } else {
            $insights[] = "No resistance training logged this week. Start a live session to activate muscle fiber recruitment.";
        }

        // Insight B: Recovery status (Calculated from sleep and training frequency)
        $latestMetrics = HealthMetric::where('user_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        $avgSleep = $latestMetrics->avg('sleep_hours') ?? 7.2;
        $avgHydration = $latestMetrics->avg('water_intake') ?? 2.8;

        if ($totalWorkoutsThisWeek >= 4) {
            if ($avgSleep < 6.5) {
                $insights[] = "Recovery index is decreasing. Overtraining risk is high due to low circadian sleep duration vs intense frequency.";
            } else {
                $insights[] = "Muscle recovery rate is optimal. Excellent balance of high-frequency stimulation and restorative sleep.";
            }
        } else {
            if ($avgSleep < 6.0) {
                $insights[] = "Systemic recovery rate is low. Prioritize continuous sleep cycles to restore baseline nervous system output.";
            } else {
                $insights[] = "Cardiovascular recovery metrics are stable. Energy reserves are primed for your next session.";
            }
        }

        // Insight C: Sleep affecting strength (Neuro correlation)
        if ($avgSleep < 6.5) {
            $insights[] = "Sleep deprivation detected. Rest deficit is affecting neuromuscular recruitment, rep velocity, and peak force capacity.";
        } else {
            $insights[] = "Adequate sleep duration is supporting anabolic growth hormone release and peak voluntary contraction.";
        }

        // Insight D: Hydration
        if ($avgHydration < 2.2) {
            $insights[] = "Hydration deficit: Cellular volume is critically low, increasing cramping risks and reducing muscle pump potential.";
        }

        return response()->json($insights);
    }
}
