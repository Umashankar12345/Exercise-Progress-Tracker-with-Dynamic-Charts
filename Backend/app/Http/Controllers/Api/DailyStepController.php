<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyStep;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DailyStepController extends Controller
{
    /**
     * Get the step history for the authenticated user.
     */
    public function index(Request $request)
    {
        $range = strtolower((string) $request->query('range', '7d'));
        $days = match ($range) {
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            default => 7,
        };

        $steps = Auth::user()->dailySteps()
            ->orderBy('date', 'desc')
            ->take($days)
            ->get()
            ->reverse()
            ->values()
            ->map(function($step) use ($days) {
                $label = $days > 10
                    ? Carbon::parse($step->date)->format('M j')
                    : Carbon::parse($step->date)->format('D');

                return [
                    'date' => $label,
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
