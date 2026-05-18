<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HealthMetricController extends Controller
{
    /**
     * Get height/weight history and latest calculated metrics.
     */
    public function index()
    {
        $metrics = Auth::user()->healthMetrics()
            ->orderBy('date', 'asc')
            ->take(30)
            ->get();

        return response()->json([
            'history' => $metrics,
            'latest' => $metrics->last()
        ]);
    }

    /**
     * Log daily body metrics and calculate BMI, TDEE, Body Fat.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:20|max:300',
            'height' => 'required|numeric|min:50|max:250',
            'age' => 'required|integer|min:1|max:120',
            'gender' => 'required|string|in:Male,Female',
            'date' => 'required|date',
        ]);

        // BMI Calculation
        $heightInMeters = $validated['height'] / 100;
        $bmi = $validated['weight'] / ($heightInMeters * $heightInMeters);

        // BMR Calculation (Mifflin-St Jeor)
        if (strtolower($validated['gender']) === 'male') {
            $bmr = (10 * $validated['weight']) + (6.25 * $validated['height']) - (5 * $validated['age']) + 5;
            $bodyFat = (1.20 * $bmi) + (0.23 * $validated['age']) - 16.2;
        } else {
            $bmr = (10 * $validated['weight']) + (6.25 * $validated['height']) - (5 * $validated['age']) - 161;
            $bodyFat = (1.20 * $bmi) + (0.23 * $validated['age']) - 5.4;
        }

        // TDEE Calculation (Moderate Activity Factor 1.55)
        $tdee = $bmr * 1.55;

        // Ensure body fat is not negative or unrealistic
        $bodyFat = max(2.0, round($bodyFat, 1));

        $metric = HealthMetric::updateOrCreate(
            ['user_id' => Auth::id(), 'date' => $validated['date']],
            [
                'weight' => $validated['weight'],
                'height' => $validated['height'],
                'age' => $validated['age'],
                'gender' => $validated['gender'],
                'bmi' => round($bmi, 1),
                'tdee' => round($tdee),
                'body_fat' => $bodyFat,
            ]
        );

        return response()->json([
            'message' => 'Health metrics updated successfully',
            'data' => $metric
        ]);
    }

    /**
     * Calculate TDEE and Diet Plans dynamically.
     */
    public function getPlan()
    {
        $latest = Auth::user()->healthMetrics()->orderBy('date', 'desc')->first();

        if (!$latest) {
            return response()->json(['message' => 'Please log your weight/height first'], 400);
        }

        $tdee = $latest->tdee;

        return response()->json([
            'tdee' => $tdee,
            'body_fat' => $latest->body_fat,
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
