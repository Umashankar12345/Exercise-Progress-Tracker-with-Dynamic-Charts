<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function streak(Request $request)
    {
        // Mock calculation of consecutive workout days
        return response()->json([
            'streak' => 3
        ]);
    }

    public function dna(Request $request)
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $workouts = \App\Models\Workout::where('user_id', $userId)->get();
        $health = \App\Models\HealthMetric::where('user_id', $userId)->get();

        $totalWorkouts = $workouts->count();
        $strengthCount = $workouts->filter(fn($w) => str_contains(strtolower($w->type), 'strength'))->count();
        $cardioCount = $workouts->filter(fn($w) => str_contains(strtolower($w->type), 'cardio'))->count();
        $avgSleep = $health->avg('sleep_hours') ?? 7.5;
        $avgWater = $health->avg('water_intake') ?? 2.5;

        // Classification algorithm
        if ($totalWorkouts >= 15) {
            $class = 'Beast Mode';
            $description = 'Unstoppable drive. You push boundaries, racking up high-frequency, high-volume sessions. Recovery is your only speed bump.';
            $stats = ['Intensity' => '98%', 'Focus' => 'Power & Volume', 'Recovery' => 'Critical'];
        } elseif ($strengthCount > $cardioCount * 2 && $strengthCount > 0) {
            $class = 'Warrior';
            $description = 'Strength is your domain. Focused heavily on progressive overload and compound lifts, you build physical resilience.';
            $stats = ['Intensity' => '85%', 'Focus' => 'Strength & Power', 'Recovery' => 'High'];
        } elseif ($totalWorkouts >= 5 && $cardioCount > 0 && $strengthCount > 0) {
            $class = 'Athlete';
            $description = 'Precision performance. You balance cardiovascular endurance with muscular strength, maintaining prime athletic conditioning.';
            $stats = ['Intensity' => '90%', 'Focus' => 'Conditioning & Symmetry', 'Recovery' => 'Optimised'];
        } else {
            $class = 'Balanced Human';
            $description = 'Mindful balance. You sync work, hydration, sleep, and activity to cultivate long-term wellness and functional health.';
            $stats = ['Intensity' => '65%', 'Focus' => 'Wellness & Longevity', 'Recovery' => 'Excellent'];
        }

        return response()->json([
            'class' => $class,
            'description' => $description,
            'stats' => $stats,
            'breakdown' => [
                'total_workouts' => $totalWorkouts,
                'strength_workouts' => $strengthCount,
                'cardio_workouts' => $cardioCount,
                'average_sleep' => round($avgSleep, 1),
                'average_water' => round($avgWater, 1)
            ]
        ]);
    }
}
