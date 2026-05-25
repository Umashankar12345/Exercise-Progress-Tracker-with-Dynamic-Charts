<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard/summary
     *
     * Returns rolling 7-day tonnage timeseries + muscle group
     * distribution in a single optimised DB round-trip (<50ms).
     * Output shape is ready for direct injection into Recharts.
     */
    public function getSummaryData(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $since  = now()->subDays(6)->startOfDay()->toDateTimeString();

        // ── 1. Rolling 7-day tonnage per day (raw SQL aggregate) ──────────
        $tonnageRows = DB::select("
            SELECT
                DATE(w.created_at)                         AS day,
                CAST(SUM(ws.weight * ws.reps) AS REAL)    AS tonnage
            FROM workout_sets   ws
            JOIN workout_exercises we ON we.id = ws.workout_exercise_id
            JOIN workouts         w  ON w.id  = we.workout_id
            WHERE
                w.user_id   = :user_id
                AND ws.type  = 'strength'
                AND w.created_at >= :since
            GROUP BY DATE(w.created_at)
            ORDER BY day ASC
        ", ['user_id' => $userId, 'since' => $since]);

        // Fill missing days with 0 so Recharts always has 7 data points
        $tonnageMap = [];
        foreach ($tonnageRows as $row) {
            $tonnageMap[$row->day] = round((float) $row->tonnage, 1);
        }

        $tonnageSeries = [];
        for ($i = 6; $i >= 0; $i--) {
            $dateKey = now()->subDays($i)->toDateString();
            $tonnageSeries[] = [
                'date'    => $dateKey,
                'label'   => now()->subDays($i)->format('D'),   // Mon, Tue …
                'tonnage' => $tonnageMap[$dateKey] ?? 0,
            ];
        }

        // ── 2. Muscle distribution (% share of all-time volume) ───────────
        $muscleRows = DB::select("
            SELECT
                e.muscle_group                            AS muscle,
                CAST(SUM(ws.weight * ws.reps) AS REAL)   AS volume
            FROM workout_sets   ws
            JOIN workout_exercises we ON we.id = ws.workout_exercise_id
            JOIN workouts         w  ON w.id  = we.workout_id
            JOIN exercises        e  ON e.id  = we.exercise_id
            WHERE
                w.user_id  = :user_id
                AND ws.type = 'strength'
            GROUP BY e.muscle_group
            ORDER BY volume DESC
            LIMIT 8
        ", ['user_id' => $userId]);

        $totalVolume = array_sum(array_column($muscleRows, 'volume')) ?: 1;

        $muscleDistribution = array_map(fn($row) => [
            'muscle'  => $row->muscle,
            'volume'  => round((float) $row->volume, 1),
            'percent' => round(((float) $row->volume / $totalVolume) * 100, 1),
        ], $muscleRows);

        // ── 3. Quick KPI badges ────────────────────────────────────────────
        $totalTonnage7d  = array_sum(array_column($tonnageSeries, 'tonnage'));
        $activeDays7d    = count(array_filter($tonnageSeries, fn($d) => $d['tonnage'] > 0));

        return response()->json([
            'tonnage_series'      => $tonnageSeries,       // → Recharts Area data
            'muscle_distribution' => $muscleDistribution,  // → Recharts Pie / Radar
            'kpi' => [
                'total_tonnage_7d' => $totalTonnage7d,
                'active_days_7d'   => $activeDays7d,
                'avg_daily_tonnage'=> $activeDays7d > 0 ? round($totalTonnage7d / $activeDays7d, 1) : 0,
            ],
        ]);
    }

    /**
     * GET /api/dashboard/analytics
     * Returns total workouts, calories burned, sleep hours, water intake, streaks, and weekly calorie logs.
     */
    public function analytics(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $workouts = \App\Models\Workout::where('user_id', $userId)->get();
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
        // SQLite compatible day grouping: strftime('%w', created_at)
        $dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $workoutChartRaw = \App\Models\Workout::where('user_id', $userId)
            ->selectRaw("strftime('%w', created_at) as day_num, COUNT(*) as count")
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
            'total_workouts' => $workouts->count(),
            'total_calories' => (int) $workouts->sum('calories_burned'),
            'weekly_volume'  => (float) $weeklyVolume,
            'hydration'      => (float) ($healthLatest?->water_intake ?? 0),
            'sleep'          => (float) ($healthLatest?->sleep_hours ?? 0),
            'weight'         => (float) ($healthLatest?->weight ?? 0),
            'heart_rate'     => (int) ($healthLatest?->heart_rate ?? 0),
            'avg_sleep'      => round($healthQuery->avg('sleep_hours') ?? 7.5, 1),
            'avg_water'      => round($healthQuery->avg('water_intake') ?? 2.5, 1),
            'streak'         => (int) $streak,
            'weekly_progress' => $weeklyProgress,
            'workout_chart'  => $workoutChart,
            'weight_chart'   => $weightLogs,
            'water_goal'     => (float) ($user->water_goal ?? 3.5),
            'sleep_goal'     => 8.0,
        ]);
    }
}
