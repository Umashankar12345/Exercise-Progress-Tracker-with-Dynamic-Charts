<?php

namespace App\Http\Controllers\Api;

use App\Models\Workout;
use Illuminate\Http\Request;

class WorkoutController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->workouts()->with('workoutExercises.workoutSets')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'started_at' => 'required|date',
            'ended_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $workout = $request->user()->workouts()->create($validated);
        return response()->json($workout, 201);
    }

    public function show(Workout $workout)
    {
        return response()->json($workout->load('workoutExercises.workoutSets'));
    }

    public function update(Request $request, Workout $workout)
    {
        $workout->update($request->all());
        return response()->json($workout);
    }

    public function destroy(Workout $workout)
    {
        $workout->delete();
        return response()->json(null, 204);
    }
}
