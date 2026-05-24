<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\ProgressService;
use App\Services\AIService;

class ProgressController extends Controller
{
    protected $progressService;
    protected $aiService;

    public function __construct(ProgressService $progressService, AIService $aiService)
    {
        $this->progressService = $progressService;
        $this->aiService = $aiService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $exerciseName = $request->query('exercise', 'Bench Press');
        $range = $request->query('range', '30d');

        $exerciseNameNormalized = str_replace('-', ' ', $exerciseName);

        $query = \App\Models\WorkoutSet::whereHas('workoutExercise', function ($q) use ($user, $exerciseNameNormalized) {
            $q->whereHas('workout', function ($q2) use ($user) {
                $q2->where('user_id', $user->id);
            })->whereHas('exercise', function ($q3) use ($exerciseNameNormalized) {
                $q3->where('name', 'like', $exerciseNameNormalized);
            });
        });

        $days = match (strtolower($range)) {
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            default => null,
        };

        if ($days) {
            $query->where('workout_sets.created_at', '>=', now()->subDays($days));
        }

        $sets = $query->with('workoutExercise.workout')
            ->get()
            ->groupBy(function ($set) {
                return $set->workoutExercise->workout->started_at->toDateString();
            });

        $data = [];
        foreach ($sets as $date => $dateSets) {
            $volume = 0;
            $maxWeight = 0;
            foreach ($dateSets as $set) {
                $volume += $set->reps * $set->weight;
                if ($set->weight > $maxWeight) {
                    $maxWeight = $set->weight;
                }
            }
            $data[] = [
                'date' => date('M d', strtotime($date)),
                'volume' => (float)$volume,
                'intensity' => (float)$maxWeight,
                'sessions' => 1,
            ];
        }

        usort($data, function ($a, $b) {
            return strtotime($a['date']) <=> strtotime($b['date']);
        });

        return response()->json($data);
    }

    public function summary(Request $request)
    {
        $user = $request->user();
        
        $totalVolume = \App\Models\WorkoutSet::whereHas('workoutExercise.workout', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->get()->sum(function($set) {
            return $set->reps * $set->weight;
        });

        $prsCount = \App\Models\WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->join('workout_exercises', 'workout_sets.workout_exercise_id', '=', 'workout_exercises.id')
        ->select('workout_exercises.exercise_id')
        ->distinct()
        ->count();

        // Calculate dynamic streak
        $dates = \App\Models\Workout::where('user_id', $user->id)
            ->selectRaw('DATE(started_at) as day')
            ->groupBy('day')
            ->orderByDesc('day')
            ->pluck('day')
            ->toArray();

        $streak = 0;
        $check  = now()->toDateString();

        foreach ($dates as $day) {
            if ($day === $check) {
                $streak++;
                $check = now()->subDays($streak)->toDateString();
            } else if ($day === now()->subDay()->toDateString() && $streak === 0) {
                $streak = 1;
                $check = now()->subDays(2)->toDateString();
            } else {
                break;
            }
        }

        return response()->json([
            'total_workouts' => $user->workouts()->count(),
            'total_volume' => $totalVolume,
            'prs' => $prsCount,
            'streak' => $streak ?: 1 // Fallback to 1 if new user logs workout
        ]);
    }

    public function chart(Request $request)
    {
        return $this->index($request);
    }

    public function muscles(Request $request)
    {
        $user = $request->user();

        $sets = \App\Models\WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->join('workout_exercises', 'workout_sets.workout_exercise_id', '=', 'workout_exercises.id')
        ->join('exercises', 'workout_exercises.exercise_id', '=', 'exercises.id')
        ->selectRaw('exercises.muscle_group, SUM(workout_sets.weight * workout_sets.reps) as total_volume')
        ->groupBy('exercises.muscle_group')
        ->get();

        $totalVolumeAll = $sets->sum('total_volume');

        if ($totalVolumeAll == 0) {
            return response()->json([
                ['name' => 'Chest', 'percentage' => 0],
                ['name' => 'Back', 'percentage' => 0],
                ['name' => 'Legs', 'percentage' => 0],
            ]);
        }

        $data = $sets->map(function ($group) use ($totalVolumeAll) {
            return [
                'name' => $group->muscle_group,
                'percentage' => round(($group->total_volume / $totalVolumeAll) * 100),
            ];
        })->sortByDesc('percentage')->values();

        return response()->json($data);
    }

}
