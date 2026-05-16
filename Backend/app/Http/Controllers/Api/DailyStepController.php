<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DailyStepController extends Controller
{
    /**
     * Get the step history for the authenticated user.
     */
    public function index()
    {
        $steps = Auth::user()->dailySteps()
            ->orderBy('date', 'desc')
            ->take(7)
            ->get()
            ->reverse()
            ->values()
            ->map(function($step) {
                return [
                    'date' => \Carbon\Carbon::parse($step->date)->format('D'),
                    'step_count' => $step->step_count,
                    'calories_burned' => $step->calories_burned,
                    'full_date' => $step->date
                ];
            });

        return response()->json($steps);
    }

    /**
     * Store or update daily steps.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'step_count' => 'required|integer|min:0',
            'date' => 'required|date',
        ]);

        // Simple calorie calculation: ~0.04 calories per step
        $calories = $validated['step_count'] * 0.04;

        $dailyStep = DailyStep::updateOrCreate(
            ['user_id' => Auth::id(), 'date' => $validated['date']],
            [
                'step_count' => $validated['step_count'],
                'calories_burned' => $calories,
            ]
        );

        return response()->json([
            'message' => 'Steps updated successfully',
            'data' => $dailyStep
        ]);
    }
}
