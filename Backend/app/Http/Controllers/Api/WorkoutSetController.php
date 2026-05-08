<?php

namespace App\Http\Controllers\Api;

use App\Models\WorkoutSet;
use Illuminate\Http\Request;

class WorkoutSetController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkoutSet::query();
        
        if ($request->has('workout_exercise_id')) {
            $query->where('workout_exercise_id', $request->workout_exercise_id);
        }
        
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'workout_exercise_id' => 'required|exists:workout_exercises,id',
            'reps' => 'required|integer|min:0',
            'weight' => 'required|numeric|min:0',
            'order' => 'nullable|integer',
        ]);

        $set = WorkoutSet::create($validated);
        return response()->json($set, 201);
    }

    public function show(WorkoutSet $set)
    {
        return response()->json($set);
    }

    public function update(Request $request, WorkoutSet $set)
    {
        $validated = $request->validate([
            'reps' => 'sometimes|integer|min:0',
            'weight' => 'sometimes|numeric|min:0',
            'order' => 'sometimes|integer',
        ]);

        $set->update($validated);
        return response()->json($set);
    }

    public function destroy(WorkoutSet $set)
    {
        $set->delete();
        return response()->json(null, 204);
    }
}
