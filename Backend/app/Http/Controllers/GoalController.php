<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->goals);
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
