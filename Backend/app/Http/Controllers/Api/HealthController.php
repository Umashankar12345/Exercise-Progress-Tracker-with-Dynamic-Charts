<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthMetric;

class HealthController extends Controller
{
    public function dashboard()
    {
        $user = auth('sanctum')->user();
        $userId = $user ? $user->id : 1;

        // Return latest metric or null
        $latest = HealthMetric::where('user_id', $userId)->latest()->first();
        
        $dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Get the last 7 days of sleep and water data for the charts
        $weeklyRaw = HealthMetric::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(7)->startOfDay())
            ->selectRaw("strftime('%w', created_at) as day_num, AVG(sleep_hours) as sleep, AVG(water_intake) as water, AVG(stress_level) as stress")
            ->groupBy('day_num')
            ->get()
            ->map(function($row) use ($dayNames) {
                return [
                    'day' => $dayNames[(int)$row->day_num] ?? 'Unknown',
                    'sleep_hours' => round((float)$row->sleep, 1),
                    'water_intake' => round((float)$row->water, 1),
                    'stress_level' => round((float)$row->stress),
                ];
            });

        return response()->json([
            'latest' => $latest,
            'weekly' => $weeklyRaw
        ]);
    }

    public function analytics()
    {
        $user = auth('sanctum')->user();
        $userId = $user ? $user->id : 1;

        return response()->json([
            'heart_rate_avg' => HealthMetric::where('user_id', $userId)->avg('heart_rate') ?? 75,
            'steps_total' => HealthMetric::where('user_id', $userId)->sum('steps') ?? 0,
            'water_avg' => HealthMetric::where('user_id', $userId)->avg('water_intake') ?? 2.0,
            'sleep_avg' => HealthMetric::where('user_id', $userId)->avg('sleep_hours') ?? 7.0,
        ]);
    }
}
