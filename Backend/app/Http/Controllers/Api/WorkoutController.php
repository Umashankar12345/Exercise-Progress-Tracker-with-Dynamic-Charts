<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workout;
use Illuminate\Http\Request;

class WorkoutController extends Controller
{
    public function index()
    {
        return Workout::with('workoutExercises.exercise', 'workoutExercises.workoutSets')->latest()->get();
    }


    public function store(Request $request)
    {
        // Support ARWorkoutMode and other modes by mapping title / exercise_name to name
        if ($request->has('title') && !$request->has('name') && !$request->has('exercise_name')) {
            $request->merge(['name' => $request->input('title'), 'exercise_name' => $request->input('title')]);
        }

        if ($request->has('calories') && !$request->has('calories_burned')) {
            $request->merge(['calories_burned' => $request->input('calories')]);
        }

        if (!$request->has('sets') && $request->has('reps')) {
            $request->merge(['sets' => 1]);
        }

        // Validate the request payload depending on whether it's a flat log or structured nested sets
        if ($request->has('exercise_name') || !is_array($request->input('sets'))) {
            $request->validate([
                'exercise_name' => 'required|string',
                'sets' => 'required|integer',
                'reps' => 'required|integer',
                'duration' => 'required'
            ]);

            $name = $request->input('exercise_name');
            $setCount = (int) $request->input('sets');
            $totalReps = (int) $request->input('reps');
            $weight = (float) ($request->input('weight') ?? 0);
            $type = $request->input('type') ?? 'strength';

            $repsPerSet = $setCount > 0 ? (int)ceil($totalReps / $setCount) : $totalReps;
            $setsArray = [];
            for ($i = 0; $i < $setCount; $i++) {
                $setsArray[] = [
                    'reps' => $repsPerSet,
                    'weight' => $weight,
                    'type' => $type,
                ];
            }

            $request->merge([
                'name' => $name,
                'sets' => $setsArray,
            ]);
        } else {
            $request->validate([
                'name' => 'required|string',
                'sets' => 'required|array|min:1',
                'sets.*.reps' => 'nullable|integer',
                'sets.*.weight' => 'nullable|numeric',
                'sets.*.distance' => 'nullable|numeric',
                'sets.*.duration_seconds' => 'nullable|integer',
                'sets.*.type' => 'nullable|string',
                'duration' => 'nullable'
            ]);
        }

        $user = $request->user();
        $userId = $user ? $user->id : 1; // Fallback to 1 for guest/demo sessions

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            // Calculate total reps and volume for calorie/duration estimations
            $totalVolume = 0;
            $totalReps = 0;
            foreach ($request->sets as $setData) {
                $reps = $setData['reps'] ?? 0;
                $weight = $setData['weight'] ?? 0;
                $totalVolume += $reps * $weight;
                $totalReps += $reps;
            }

            // Estimate duration: 5 minutes per set, clamped between 10 and 120 mins
            $setCount = count($request->sets);
            $duration = $request->duration ?? max(10, min(120, $setCount * 5));

            // Estimate calories: ~4 kcal per rep + ~0.05 kcal per kg lifted
            $calories = $request->calories_burned ?? max(50, min(800, round(($totalReps * 4) + ($totalVolume * 0.05))));

            $workout = Workout::create([
                'user_id'         => $userId,
                'name'            => $request->name,
                'title'           => $request->name,
                'duration'        => $duration,
                'calories_burned' => $calories,
                'reps'            => $totalReps,
                'type'            => ($setCount > 0 && ($request->sets[0]['type'] ?? 'strength') === 'cardio') ? 'Cardio Session' : 'Strength Session',
                'started_at'      => $request->started_at ?? now(),
                'ended_at'        => $request->ended_at ?? now(),
                'notes'           => $request->notes ?? null,
            ]);

            // Find or create exercise
            $exercise = \App\Models\Exercise::firstOrCreate(
                ['name' => $request->name],
                ['muscle_group' => 'Unknown']
            );

            // Create workout exercise mapping
            $workoutEx = $workout->workoutExercises()->create([
                'exercise_id' => $exercise->id,
                'user_id'     => $userId,
                'notes'       => $request->notes ?? null,
            ]);

            foreach ($request->sets as $index => $setData) {
                $workoutEx->workoutSets()->create([
                    'reps'             => $setData['reps'] ?? 0,
                    'weight'           => $setData['weight'] ?? 0,
                    'order'            => $index + 1,
                    'distance'         => $setData['distance'] ?? null,
                    'duration_seconds' => $setData['duration_seconds'] ?? null,
                    'type'             => $setData['type'] ?? 'strength',
                ]);
            }

            \Illuminate\Support\Facades\DB::commit();
            
            // Load relationships before returning
            return response()->json($workout->load('workoutExercises.workoutSets'));

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json([
                'error'   => 'Failed to save workout data.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function analytics(Request $request)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        $userId = $user ? $user->id : 1;

        // SQLite-compatible: strftime('%w') returns 0=Sunday, 1=Monday ... 6=Saturday
        $dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        $weeklyRaw = Workout::where('user_id', $userId)
            ->selectRaw("strftime('%w', created_at) as day_num, SUM(calories_burned) as calories")
            ->groupBy('day_num')
            ->get()
            ->map(fn($row) => [
                'day'      => $dayNames[(int)$row->day_num] ?? 'Unknown',
                'calories' => (int)$row->calories,
            ]);

        return response()->json([
            'total_workouts' => Workout::where('user_id', $userId)->count(),
            'total_calories' => (int) Workout::where('user_id', $userId)->sum('calories_burned'),
            'avg_duration'   => round(Workout::where('user_id', $userId)->avg('duration') ?? 0),
            'weekly'         => $weeklyRaw,
        ]);
    }
    
    public function heatmapData(Request $request)
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $data = Workout::where('user_id', $userId)
            ->selectRaw('DATE(created_at) as date, SUM(calories_burned) as calories, COUNT(*) as count')
            ->groupBy('date')
            ->get();
            
        return response()->json($data);
    }

    public function prs(Request $request)
    {
        $user = $request->user();
        
        $prs = \App\Models\WorkoutSet::whereHas('workoutExercise', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->join('workout_exercises', 'workout_sets.workout_exercise_id', '=', 'workout_exercises.id')
            ->join('exercises', 'workout_exercises.exercise_id', '=', 'exercises.id')
            ->selectRaw('exercises.name as exercise, MAX(workout_sets.weight) as weight, DATE(workout_sets.created_at) as date')
            ->groupBy('exercises.id', 'exercises.name')
            ->get();

        return response()->json($prs);
    }

    public function update(Request $request, $id)
    {
        $workout = Workout::findOrFail($id);
        
        $userId = \Illuminate\Support\Facades\Auth::id() ?: 1;
        if ($workout->user_id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'nullable|string',
            'notes' => 'nullable|string',
            'duration' => 'nullable|integer',
            'calories_burned' => 'nullable|integer',
        ]);

        $workout->update([
            'name' => $request->input('name') ?? $workout->name,
            'title' => $request->input('name') ?? $workout->name,
            'notes' => $request->input('notes') ?? $workout->notes,
            'duration' => $request->input('duration') ?? $workout->duration,
            'calories_burned' => $request->input('calories_burned') ?? $workout->calories_burned,
        ]);

        return response()->json($workout);
    }

    public function destroy($id)
    {
        $workout = Workout::findOrFail($id);
        
        $userId = \Illuminate\Support\Facades\Auth::id() ?: 1;
        if ($workout->user_id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $workout->delete();

        return response()->json(['success' => true, 'message' => 'Workout deleted successfully']);
    }
}
