<?php

namespace App\Http\Controllers\Api;

use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = $request->user()->goals->map(function ($goal) {
            // Mock percentage calculation
            $goal->percentage = $goal->target_weight ? min(100, rand(10, 90)) : 0; 
            return $goal;
        });
        return response()->json($goals);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_weight' => 'nullable|numeric',
            'goal_date' => 'nullable|date',
            'is_achieved' => 'boolean',
        ]);

        $goal = $request->user()->goals()->create($validated);
        return response()->json($goal, 201);
    }

    public function show(Goal $goal)
    {
        return response()->json($goal);
    }

    public function update(Request $request, Goal $goal)
    {
        $goal->update($request->all());
        return response()->json($goal);
    }

    public function destroy(Goal $goal)
    {
        $goal->delete();
        return response()->json(null, 204);
    }
}
