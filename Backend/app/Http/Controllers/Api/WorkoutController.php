<?php

namespace App\Http\Controllers\Api;

use App\Models\Workout;
use App\Events\WorkoutSaved;
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
            'sets' => 'required|array|min:1',
            'sets.*.reps' => 'required|integer|min:1',
            'sets.*.weight' => 'required|numeric|min:0',
        ]);

        $workout = $request->user()->workouts()->create([
            'name' => $validated['name'],
            'started_at' => $validated['started_at'],
            'ended_at' => $validated['ended_at'],
            'notes' => $validated['notes'],
        ]);

        // Find or create Exercise to get an ID
        $exerciseModel = \App\Models\Exercise::firstOrCreate(
            ['name' => $validated['name']],
            ['muscle_group' => 'Unknown'] // Default group if new
        );

        // Create the WorkoutExercise junction record
        $workoutEx = $workout->workoutExercises()->create([
            'exercise_id' => $exerciseModel->id,
            'notes' => $validated['notes'],
        ]);

        // Create the individual Sets
        if (!empty($validated['sets'])) {
            foreach ($validated['sets'] as $index => $setData) {
                $workoutEx->workoutSets()->create([
                    'reps' => $setData['reps'],
                    'weight' => $setData['weight'],
                    'order' => $index + 1,
                ]);
            }
        }
        
        // Pass userId (int) as expected by the job constructor
        \App\Jobs\AnalyzeWorkoutJob::dispatch($request->user()->id);
        
        $totalSets = count($validated['sets'] ?? []);
        $totalVolume = 0;
        foreach ($validated['sets'] ?? [] as $set) {
            $totalVolume += ($set['weight'] ?? 0) * ($set['reps'] ?? 0);
        }

        broadcast(new WorkoutSaved(
            $request->user()->id,
            $workout->id,
            $workout->name,
            $totalSets,
            $totalVolume,
            now()->toIso8601String()
        ))->toOthers();
        
        return response()->json($workout->load('workoutExercises.workoutSets'), 201);
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

    public function prs(Request $request)
    {
        $userId = $request->user()->id;

        $prs = \App\Models\WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->join('workout_exercises', 'workout_sets.workout_exercise_id', '=', 'workout_exercises.id')
        ->join('exercises', 'workout_exercises.exercise_id', '=', 'exercises.id')
        ->selectRaw('exercises.name as exercise, MAX(workout_sets.weight) as weight, DATE(MAX(workout_sets.created_at)) as date')
        ->groupBy('exercises.name')
        ->get()
        ->map(function ($pr) {
            return [
                'exercise' => $pr->exercise,
                'weight' => (float)$pr->weight,
                'date' => $pr->date,
            ];
        });

        return response()->json($prs);
    }
}
