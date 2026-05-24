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
            'weight' => 'nullable|numeric|min:20|max:300',
            'height' => 'nullable|numeric|min:50|max:250',
            'age' => 'nullable|integer|min:1|max:120',
            'gender' => 'nullable|string|in:Male,Female',
            'date' => 'required|date',
            'heart_rate' => 'nullable|integer|min:30|max:220',
            'water_intake' => 'nullable|numeric|min:0|max:20',
            'steps' => 'nullable|integer|min:0|max:100000',
            'sleep_hours' => 'nullable|numeric|min:0|max:24',
            'stress_level' => 'nullable|integer|min:0|max:100',
        ]);

        $existing = HealthMetric::where('user_id', Auth::id())
            ->where('date', $validated['date'])
            ->first();

        $latest = HealthMetric::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->first();

        $height = $validated['height'] ?? ($existing ? $existing->height : ($latest ? $latest->height : 175));
        $weight = $validated['weight'] ?? ($existing ? $existing->weight : ($latest ? $latest->weight : 70));
        $age = $validated['age'] ?? ($existing ? $existing->age : ($latest ? $latest->age : 25));
        $gender = $validated['gender'] ?? ($existing ? $existing->gender : ($latest ? $latest->gender : 'Male'));

        // BMI Calculation
        $heightInMeters = $height / 100;
        $bmi = $weight / ($heightInMeters * $heightInMeters);

        // BMR Calculation (Mifflin-St Jeor)
        if (strtolower($gender) === 'male') {
            $bmr = (10 * $weight) + (6.25 * $height) - (5 * $age) + 5;
            $bodyFat = (1.20 * $bmi) + (0.23 * $age) - 16.2;
        } else {
            $bmr = (10 * $weight) + (6.25 * $height) - (5 * $age) - 161;
            $bodyFat = (1.20 * $bmi) + (0.23 * $age) - 5.4;
        }

        // TDEE Calculation (Moderate Activity Factor 1.55)
        $tdee = $bmr * 1.55;

        // Ensure body fat is not negative or unrealistic
        $bodyFat = max(2.0, round($bodyFat, 1));

        $metric = HealthMetric::updateOrCreate(
            ['user_id' => Auth::id(), 'date' => $validated['date']],
            [
                'weight' => $weight,
                'height' => $height,
                'age' => $age,
                'gender' => $gender,
                'bmi' => round($bmi, 1),
                'tdee' => round($tdee),
                'body_fat' => $bodyFat,
                'heart_rate' => $validated['heart_rate'] ?? ($existing ? $existing->heart_rate : null),
                'water_intake' => $validated['water_intake'] ?? ($existing ? $existing->water_intake : null),
                'steps' => $validated['steps'] ?? ($existing ? $existing->steps : null),
                'sleep_hours' => $validated['sleep_hours'] ?? ($existing ? $existing->sleep_hours : null),
                'stress_level' => $validated['stress_level'] ?? ($existing ? $existing->stress_level : null),
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
            return response()->json(null, 200);
        }

        $tdee = $latest->tdee ?? 2200;
        $weight = $latest->weight ?? 70;
        $height = $latest->height ?? 175;
        $age = $latest->age ?? 25;
        $gender = $latest->gender ?? 'Male';
        $bmi = $latest->bmi ?? 22.8;

        // Dynamic BMI recalculation checks
        $heightInMeters = $height / 100;
        $calculatedBmi = $weight / ($heightInMeters * $heightInMeters);

        // US Navy Body Fat estimation formula (simplified approximation based on height, weight, waist estimation)
        // Waist estimation: Males approx weight * 1.2, Females weight * 1.3
        if (strtolower($gender) === 'male') {
            $navyBodyFat = 86.010 * log10(max(10, $weight * 1.2 - 37)) - 70.041 * log10($height) + 36.76;
        } else {
            $navyBodyFat = 163.205 * log10(max(10, $weight * 1.3 - 35)) - 97.684 * log10($height) - 78.387;
        }
        $navyBodyFat = max(3.0, min(50.0, round($navyBodyFat, 1)));

        // Sleep Recovery scoring (out of 100)
        $sleepHours = $latest->sleep_hours ?? 7.0;
        $stressLevel = $latest->stress_level ?? 30; // 0 to 100
        $sleepScore = ($sleepHours / 8.0) * 100;
        $sleepScore -= ($stressLevel * 0.2); // stress detracts from recovery
        $sleepScore = (int) max(20, min(100, round($sleepScore)));

        // Health Risk Analysis
        $risk = 'Low Health Risk';
        if ($bmi < 18.5) {
            $risk = 'Underweight - Potential nutritional deficiencies and immune risk.';
        } elseif ($bmi >= 25 && $bmi < 30) {
            $risk = 'Overweight - Moderate risk of cardiovascular conditions and lipid disorders.';
        } elseif ($bmi >= 30) {
            $risk = 'Obese - High risk of metabolic syndrome, hypertension, and diabetes.';
        }

        // Weight progression prediction (12 weeks forecast)
        $forecastLoss = [];
        $forecastGain = [];
        for ($i = 1; $i <= 12; $i++) {
            $forecastLoss[] = [
                'week' => 'Wk ' . $i,
                'weight' => round($weight - ($i * 0.5), 1)
            ];
            $forecastGain[] = [
                'week' => 'Wk ' . $i,
                'weight' => round($weight + ($i * 0.25), 1)
            ];
        }

        return response()->json([
            'tdee' => $tdee,
            'body_fat' => $latest->body_fat,
            'navy_body_fat' => $navyBodyFat,
            'bmi' => round($calculatedBmi, 1),
            'health_risk' => $risk,
            'sleep_recovery_score' => $sleepScore,
            'forecast_loss' => $forecastLoss,
            'forecast_gain' => $forecastGain,
            'loss' => [
                'target_calories' => round($tdee - 500),
                'protein' => round($weight * 2.0),
                'carbs' => round($weight * 2.5),
                'fats' => round($weight * 0.8),
                'tips' => [
                    "Maintain a 500 kcal deficit daily.",
                    "Focus on high-volume low-calorie foods (greens, lean protein).",
                    "Aim for 10k steps daily to aid fat loss.",
                    "Prioritize protein to protect lean muscle mass."
                ]
            ],
            'gain' => [
                'target_calories' => round($tdee + 500),
                'protein' => round($weight * 2.2),
                'carbs' => round($weight * 5.0),
                'fats' => round($weight * 1.0),
                'tips' => [
                    "Consume a 500 kcal surplus for muscle growth.",
                    "Eat 1g of protein per lb of bodyweight.",
                    "Focus on progressive overload in your lifting sessions.",
                    "Eat nutrient-dense fats (avocados, nuts) to hit calorie goals."
                ]
            ]
        ]);
    }
}
