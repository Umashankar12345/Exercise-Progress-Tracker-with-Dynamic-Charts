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

    public function analytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $workouts = \App\Models\Workout::where('user_id', $userId)->get();
        $todayWorkouts = \App\Models\Workout::where('user_id', $userId)
            ->whereDate('created_at', now()->toDateString())
            ->get();
            
        $todayCalories = (int) $todayWorkouts->sum('calories_burned');
        $todayActiveMinutes = (int) $todayWorkouts->sum('duration'); // Assuming duration is in minutes
        
        $healthToday = \App\Models\HealthMetric::where('user_id', $userId)
            ->where('date', now()->toDateString())
            ->first();
            
        $healthLatest = \App\Models\HealthMetric::where('user_id', $userId)->latest()->first();
        $healthQuery = \App\Models\HealthMetric::where('user_id', $userId);

        $streak = \App\Models\Workout::where('user_id', $userId)
            ->selectRaw('COUNT(DISTINCT DATE(created_at)) as streak')
            ->first()->streak ?? 0;

        // Calculate weekly volume (sum of weight * reps in the last 7 days)
        $weeklyVolume = \App\Models\WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($userId) {
            $q->where('user_id', $userId)
              ->where('created_at', '>=', now()->subDays(7)->startOfDay());
        })->sum(DB::raw('weight * reps'));

        // Group workouts by day of week for workout_chart
        $dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Fix for SQLite/MySQL compatibility on day grouping
        $dbDriver = DB::connection()->getDriverName();
        $selectRaw = $dbDriver === 'sqlite' 
            ? "strftime('%w', created_at) as day_num, COUNT(*) as count"
            : "DAYOFWEEK(created_at) - 1 as day_num, COUNT(*) as count";
            
        $workoutChartRaw = \App\Models\Workout::where('user_id', $userId)
            ->selectRaw($selectRaw)
            ->groupBy('day_num')
            ->get();
            
        $workoutChart = [];
        // Pre-fill all days with 0
        foreach ($dayNames as $name) {
            $workoutChart[$name] = 0;
        }
        foreach ($workoutChartRaw as $row) {
            $dayIndex = (int)$row->day_num;
            $dayName = $dayNames[$dayIndex] ?? 'Unknown';
            if ($dayName !== 'Unknown') {
                $workoutChart[$dayName] = (int)$row->count;
            }
        }

        // Weekly progress: past 7 days calories burned per day
        $weeklyProgress = \App\Models\Workout::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as day, SUM(calories_burned) as calories')
            ->groupBy('day')
            ->get()
            ->map(fn($row) => [
                'day' => date('D', strtotime($row->day)),
                'calories' => (int) $row->calories
            ]);
            
        // Weekly Steps
        $weeklySteps = \App\Models\HealthMetric::where('user_id', $userId)
            ->where('date', '>=', now()->subDays(6)->startOfDay())
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'day' => date('D', strtotime($row->date)),
                'steps' => (int) $row->steps
            ]);
            
        // Sleep vs Recovery (last 7 days)
        $sleepTrends = \App\Models\HealthMetric::where('user_id', $userId)
            ->where('date', '>=', now()->subDays(6)->startOfDay())
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'day' => date('D', strtotime($row->date)),
                'sleep' => (float) $row->sleep_hours,
                'recovery' => 100 - (int) $row->stress_level // rough recovery estimate
            ]);

        // Hydration Trends
        $hydrationTrends = \App\Models\HealthMetric::where('user_id', $userId)
            ->where('date', '>=', now()->subDays(6)->startOfDay())
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'day' => date('D', strtotime($row->date)),
                'water' => (float) $row->water_intake
            ]);

        $weightLogs = \App\Models\WeightLog::where('user_id', $userId)
            ->latest()
            ->take(7)
            ->get()
            ->reverse()
            ->values()
            ->map(fn($log) => [
                'date' => $log->created_at->format('m/d'),
                'weight' => (float) $log->weight
            ]);

        return response()->json([
            // NEW METRICS FOR DASHBOARD CARDS
            'steps'          => $healthToday->steps ?? ($healthLatest?->steps ?? 0),
            'calories'       => $todayCalories > 0 ? $todayCalories : ($healthToday->tdee ?? 0),
            'distance'       => round(($healthToday->steps ?? ($healthLatest?->steps ?? 0)) * 0.000762, 2), // rough est km
            'water'          => (float) ($healthToday->water_intake ?? ($healthLatest?->water_intake ?? 0)),
            'sleep'          => (float) ($healthToday->sleep_hours ?? ($healthLatest?->sleep_hours ?? 0)),
            'active_minutes' => $todayActiveMinutes,
            
            // EXISTING KPI
            'total_workouts' => $workouts->count(),
            'total_calories' => (int) $workouts->sum('calories_burned'),
            'weekly_volume'  => (float) $weeklyVolume,
            'weight'         => (float) ($healthLatest?->weight ?? 0),
            'heart_rate'     => (int) ($healthLatest?->heart_rate ?? 0),
            'avg_sleep'      => round($healthQuery->avg('sleep_hours') ?? 7.5, 1),
            'avg_water'      => round($healthQuery->avg('water_intake') ?? 2.5, 1),
            'streak'         => (int) $streak,
            
            // CHARTS
            'weekly_progress' => $weeklyProgress,
            'weekly_steps'    => $weeklySteps,
            'sleep_trends'    => $sleepTrends,
            'hydration_trends'=> $hydrationTrends,
            'workout_chart'   => $workoutChart,
            'weight_chart'    => $weightLogs,
        ]);
    }

    /**
     * GET /api/analytics/target-advising?exercise_id={id}
     */
    public function getTargetAdvising(Request $request): JsonResponse
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
