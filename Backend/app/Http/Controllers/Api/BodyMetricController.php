<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BodyMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BodyMetricController extends Controller
{
    /**
     * Get weight history and latest metrics.
     */
    public function index()
    {
        $metrics = Auth::user()->bodyMetrics()
            ->orderBy('date', 'desc')
            ->take(30)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'history' => $metrics,
            'latest' => $metrics->last()
        ]);
    }

    /**
     * Log daily body metrics and calculate BMI.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:20|max:300',
            'height' => 'required|numeric|min:50|max:250',
            'body_fat' => 'nullable|numeric|min:2|max:70',
            'date' => 'required|date',
        ]);

        // Calculate BMI: weight (kg) / [height (m)]^2
        $heightInMeters = $validated['height'] / 100;
        $bmi = $validated['weight'] / ($heightInMeters * $heightInMeters);

        $metric = BodyMetric::updateOrCreate(
            ['user_id' => Auth::id(), 'date' => $validated['date']],
            [
                'weight' => $validated['weight'],
                'height' => $validated['height'],
                'body_fat' => $validated['body_fat'],
                'bmi' => round($bmi, 2),
            ]
        );

        return response()->json([
            'message' => 'Metrics updated successfully',
            'data' => $metric
        ]);
    }

    /**
     * Calculate TDEE and Diet Plans.
     */
    public function getPlan(Request $request)
    {
        $latest = Auth::user()->bodyMetrics()->orderBy('date', 'desc')->first();
        
        if (!$latest) {
            return response()->json(['message' => 'Please log your weight/height first'], 400);
        }

        // Basic Mifflin-St Jeor Equation for BMR
        // We'll assume a moderate activity level for now
        $age = 25; // Default if not in user profile
        $bmr = (10 * $latest->weight) + (6.25 * $latest->height) - (5 * $age) + 5;
        $tdee = $bmr * 1.55; // Moderate activity factor

        return response()->json([
            'tdee' => round($tdee),
            'loss' => [
                'target_calories' => round($tdee - 500),
                'protein' => round($latest->weight * 2),
                'tips' => [
                    "Maintain a 500 kcal deficit daily.",
                    "Focus on high-volume low-calorie foods (greens, lean protein).",
                    "Aim for 10k steps daily to aid fat loss."
                ]
            ],
            'gain' => [
                'target_calories' => round($tdee + 500),
                'protein' => round($latest->weight * 2.2),
                'tips' => [
                    "Consume a 500 kcal surplus for muscle growth.",
                    "Eat 1g of protein per lb of bodyweight.",
                    "Focus on progressive overload in your lifting sessions."
                ]
            ]
        ]);
    }
}
