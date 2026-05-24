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

        // Return latest or a default mock if empty for the dashboard
        $latest = HealthMetric::where('user_id', $userId)->latest()->first();
        
        if (!$latest) {
            return response()->json([
                'heart_rate' => 72,
                'water_intake' => 2.4,
                'steps' => 8500,
                'sleep_hours' => 7.5,
                'stress_level' => 30
            ]);
        }
        
        return response()->json($latest);
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
