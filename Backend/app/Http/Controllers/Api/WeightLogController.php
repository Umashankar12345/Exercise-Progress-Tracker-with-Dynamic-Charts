<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeightLog;
use App\Models\HealthMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WeightLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $logs = WeightLog::where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'weight' => 'required|numeric|min:20|max:300',
        ]);

        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $log = WeightLog::create([
            'user_id' => $userId,
            'weight' => $request->weight,
        ]);

        // Sync with health_metrics for today
        $today = now()->toDateString();
        $existing = HealthMetric::where('user_id', $userId)->where('date', $today)->first();
        $latest = HealthMetric::where('user_id', $userId)->orderBy('date', 'desc')->first();

        $height = $existing ? $existing->height : ($latest ? $latest->height : 175);
        $age = $existing ? $existing->age : ($latest ? $latest->age : 25);
        $gender = $existing ? $existing->gender : ($latest ? $latest->gender : 'Male');

        // Recalculate BMI, BMR, TDEE
        $heightInMeters = $height / 100;
        $bmi = $request->weight / ($heightInMeters * $heightInMeters);

        if (strtolower($gender) === 'male') {
            $bmr = (10 * $request->weight) + (6.25 * $height) - (5 * $age) + 5;
            $bodyFat = (1.20 * $bmi) + (0.23 * $age) - 16.2;
        } else {
            $bmr = (10 * $request->weight) + (6.25 * $height) - (5 * $age) - 161;
            $bodyFat = (1.20 * $bmi) + (0.23 * $age) - 5.4;
        }

        $tdee = $bmr * 1.55;
        $bodyFat = max(2.0, round($bodyFat, 1));

        HealthMetric::updateOrCreate(
            ['user_id' => $userId, 'date' => $today],
            [
                'weight' => $request->weight,
                'height' => $height,
                'age' => $age,
                'gender' => $gender,
                'bmi' => round($bmi, 1),
                'tdee' => round($tdee),
                'body_fat' => $bodyFat,
            ]
        );

        return response()->json([
            'message' => 'Weight logged and metrics updated successfully',
            'log' => $log
        ]);
    }
}
