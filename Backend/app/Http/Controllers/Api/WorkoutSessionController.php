<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutSession;
use App\Models\ActivityPoint;
use App\Models\ExerciseSession;
use App\Models\HeatmapPoint;
use App\Events\WorkoutTelemetryUpdated;
use App\Events\WorkoutSessionEvent;
use App\Events\HeatmapUpdatedEvent;
use App\Events\TelemetryUpdatedEvent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WorkoutSessionController extends Controller
{
    public function start(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::create([
            'user_id'  => $userId,
            'duration' => 0,
            'calories' => 0,
            'sets'     => 0,
            'reps'     => 0,
            'status'   => 'active',
        ]);

        return response()->json($session);
    }

    public function logSet(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)->findOrFail($id);

        $request->validate([
            'exercise' => 'required|string',
            'weight'   => 'required|numeric|min:0',
            'reps'     => 'required|integer|min:0',
            'duration' => 'required|integer|min:0',
        ]);

        $loggedSets = $session->logged_sets ?? [];
        $loggedSets[] = [
            'exercise' => $request->input('exercise'),
            'weight'   => (float) $request->input('weight'),
            'reps'     => (int) $request->input('reps'),
            'duration' => (int) $request->input('duration'),
            'timestamp'=> now()->toIso8601String(),
        ];

        // Recalculate aggregates
        $duration = max(array_column($loggedSets, 'duration'));
        $totalVolume = 0;
        $totalReps = 0;
        foreach ($loggedSets as $set) {
            $totalVolume += $set['weight'] * $set['reps'];
            $totalReps += $set['reps'];
        }
        
        // Estimate calories: ~4 kcal per rep + ~0.05 kcal per kg + ~0.15 kcal per second
        $calories = round(($totalReps * 4) + ($totalVolume * 0.05) + ($duration * 0.15));

        $session->update([
            'logged_sets' => $loggedSets,
            'sets'        => count($loggedSets),
            'reps'        => $totalReps,
            'duration'    => $duration,
            'calories'    => (int) $calories,
        ]);

        return response()->json([
            'message' => 'Set logged successfully',
            'session' => $session
        ]);
    }

    public function finish(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)->findOrFail($id);

        $loggedSets = $session->logged_sets ?? [];

        if (empty($loggedSets)) {
            $dominantExercise = $session->workout_type 
                ? ucfirst($session->workout_type) . ' Session' 
                : 'General Workout';
            $totalVolume = 0;
            $totalReps = 0;
            $wType = $session->workout_type === 'run' || $session->workout_type === 'cycle' || $session->workout_type === 'walk' 
                ? 'Cardio Session' 
                : 'Strength Session';
            $notes = "Live cardio session. Distance: " . number_format($session->distance, 2) . " km, Steps: {$session->steps}, Final Heart Rate: {$session->heart_rate} bpm";
        } else {
            // Find dominant exercise (the one that appears most)
            $exercisesCount = array_count_values(array_column($loggedSets, 'exercise'));
            arsort($exercisesCount);
            $dominantExercise = key($exercisesCount);

            $totalVolume = 0;
            $totalReps = 0;
            foreach ($loggedSets as $set) {
                $totalVolume += $set['weight'] * $set['reps'];
                $totalReps += $set['reps'];
            }
            $wType = 'Strength Session';
            $notes = 'Live session details: ' . collect($loggedSets)->map(fn($s) => "{$s['exercise']} {$s['weight']}kg x {$s['reps']}")->join(', ');
        }

        $duration = (int) $request->input('duration', $session->duration);
        $duration = $duration > 0 ? $duration : $session->duration;

        // Estimate calories if zero
        $calories = (int) $request->input('calories', $session->calories);
        if ($calories <= 0) {
            if ($session->workout_type === 'run' || $session->workout_type === 'cycle' || $session->workout_type === 'walk') {
                $calories = (int) round($session->distance * 65);
            } else {
                $calories = (int) round(($totalReps * 4) + ($totalVolume * 0.05) + ($duration * 0.15));
            }
        }

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            // Store history (create Workout record)
            $workout = \App\Models\Workout::create([
                'user_id'         => $userId,
                'name'            => $dominantExercise,
                'title'           => $dominantExercise,
                'duration'        => max(1, (int) round($duration / 60)), // duration is in seconds, convert to minutes
                'calories_burned' => $calories,
                'reps'            => $totalReps,
                'type'            => $wType,
                'started_at'      => $session->created_at,
                'ended_at'        => now(),
                'notes'           => $notes,
            ]);

            // Find or create Exercise and add sets
            $groupedSets = collect($loggedSets)->groupBy('exercise');
            foreach ($groupedSets as $exName => $setsList) {
                $exercise = \App\Models\Exercise::firstOrCreate(
                    ['name' => $exName],
                    ['muscle_group' => 'Unknown']
                );

                $workoutEx = $workout->workoutExercises()->create([
                    'exercise_id' => $exercise->id,
                    'user_id'     => $userId,
                ]);

                foreach ($setsList as $index => $setData) {
                    $workoutEx->workoutSets()->create([
                        'reps'             => $setData['reps'] ?? 0,
                        'weight'           => $setData['weight'] ?? 0,
                        'order'            => $index + 1,
                        'type'             => 'strength',
                    ]);
                }
            }

            // Write summary logs to workout_logs table for charts
            if (empty($loggedSets)) {
                \App\Models\WorkoutLog::create([
                    'user_id'        => $userId,
                    'exercise_name'  => $session->workout_type === 'run' ? 'Running' : ($session->workout_type === 'cycle' ? 'Cycling' : ($session->workout_type === 'walk' ? 'Walking' : 'Cardio')),
                    'reps'           => 0,
                    'steps'          => $session->steps,
                    'calories'       => $calories,
                    'distance'       => $session->distance,
                    'duration'       => $duration,
                    'avg_heart_rate' => $session->heart_rate,
                    'intensity'      => $session->distance > 2.0 ? 'high' : ($session->distance > 0.5 ? 'medium' : 'low'),
                ]);
            } else {
                foreach ($groupedSets as $exName => $setsList) {
                    $totalReps = collect($setsList)->sum('reps');
                    $totalDuration = collect($setsList)->sum('duration');
                    $totalWeight = collect($setsList)->max('weight');
                    $exCalories = round($totalReps * 4 + $totalWeight * 0.05 + $totalDuration * 0.15);
                    
                    \App\Models\WorkoutLog::create([
                        'user_id'        => $userId,
                        'exercise_name'  => $exName,
                        'reps'           => $totalReps,
                        'steps'          => 0,
                        'calories'       => $exCalories,
                        'distance'       => 0.0,
                        'duration'       => $totalDuration,
                        'avg_heart_rate' => $session->heart_rate,
                        'intensity'      => $totalReps > 30 ? 'high' : ($totalReps > 15 ? 'medium' : 'low'),
                    ]);
                }
            }

            // Close session
            $session->update([
                'status'   => 'completed',
                'duration' => $duration,
                'calories' => $calories,
            ]);

            // Calculate and Log Activity Points
            $actType = $session->workout_type ?? 'run';
            $durationMinutes = max(1, (int) round($duration / 60));
            $intensityString = $session->distance > 2.0 ? 'high' : ($session->distance > 0.5 ? 'medium' : 'low');

            $points = 0;
            if ($actType === 'run' || $actType === 'running') {
                $points = ($durationMinutes * 10) + ($session->steps * 0.05) + ($session->distance * 5);
            } else if ($actType === 'cycle' || $actType === 'cycling') {
                $points = ($durationMinutes * 8) + ($session->distance * 3);
            } else if ($actType === 'walk' || $actType === 'walking') {
                $points = ($durationMinutes * 5) + ($session->steps * 0.03);
            } else { // strength / HIIT
                $points = ($durationMinutes * 12) + ($session->reps * 0.5);
            }

            \App\Models\ActivityPoint::create([
                'user_id' => $userId,
                'activity_type' => $actType,
                'points' => (int) round($points),
                'duration' => $duration,
                'steps' => $session->steps,
                'distance' => $session->distance,
                'calories' => $calories,
                'intensity' => $intensityString,
            ]);

            // Broadcast session completion
            broadcast(new \App\Events\WorkoutSessionEvent($session, 'stop'))->toOthers();

            \Illuminate\Support\Facades\DB::commit();

            return response()->json([
                'message' => 'Workout completed and stored in history',
                'session' => $session,
                'workout' => $workout->load('workoutExercises.workoutSets'),
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json([
                'error'   => 'Failed to finalize session.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateGps(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['error' => 'No active workout session found.'], 404);
        }

        $request->validate([
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'speed'     => 'nullable|numeric',
            'accuracy'  => 'nullable|numeric',
            'distance'  => 'nullable|numeric',
        ]);

        $gpsPath = $session->gps_path ?? [];
        $newPoint = [
            'lat'       => (float) $request->input('latitude'),
            'lng'       => (float) $request->input('longitude'),
            'speed'     => $request->input('speed') !== null ? (float) $request->input('speed') : 0.0,
            'accuracy'  => $request->input('accuracy') !== null ? (float) $request->input('accuracy') : 0.0,
            'timestamp' => now()->toIso8601String(),
        ];
        $gpsPath[] = $newPoint;

        $distance = $request->input('distance') !== null 
            ? (float) $request->input('distance') 
            : $session->distance;

        // If distance is not passed by client, calculate it from GPS path
        if ($request->input('distance') === null && count($gpsPath) > 1) {
            $last = $gpsPath[count($gpsPath) - 1];
            $prev = $gpsPath[count($gpsPath) - 2];
            
            // Haversine calculation
            $lat1 = $prev['lat'];
            $lon1 = $prev['lng'];
            $lat2 = $last['lat'];
            $lon2 = $last['lng'];
            
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $km = $miles * 1.609344;
            
            $distance = $session->distance + $km;
        }

        // Estimate active duration in seconds since session start
        $duration = now()->diffInSeconds($session->created_at);

        // Estimate calories: Run/Cycle burn approx 65 kcal per km (metabolic estimation)
        $calories = (int) round($distance * 65);

        $session->update([
            'gps_path' => $gpsPath,
            'distance' => (float) $distance,
            'duration' => $duration,
            'calories' => $calories > 0 ? $calories : $session->calories,
        ]);

        // Calculate intensity and store in heatmap_points
        $heartRate = $session->heart_rate;
        $speedVal = $newPoint['speed'];
        $effort = $request->input('effort', 50.0);
        
        $intensityScore = ($heartRate / 200.0 * 40.0) + (($speedVal / 8.0) * 30.0) + (($effort / 100.0) * 30.0);
        $intensityScore = min(100.0, max(0.0, $intensityScore));
        
        $heatmapPoint = \App\Models\HeatmapPoint::create([
            'user_id' => $userId,
            'workout_session_id' => $session->id,
            'latitude' => $newPoint['lat'],
            'longitude' => $newPoint['lng'],
            'speed' => $speedVal,
            'heart_rate' => $heartRate,
            'calories' => $session->calories,
            'steps' => $session->steps,
            'intensity' => (int) round($intensityScore),
        ]);

        // Broadcast telemetry update via Reverb websockets
        broadcast(new WorkoutTelemetryUpdated($session, $userId, 'gps'))->toOthers();
        broadcast(new \App\Events\HeatmapUpdatedEvent($userId, $heatmapPoint))->toOthers();
        
        $telemetryData = [
            'duration' => $session->duration,
            'calories' => $session->calories,
            'steps' => $session->steps,
            'distance' => $session->distance,
            'speed' => $speedVal,
            'cadence' => $session->cadence,
            'heartRate' => $heartRate,
            'activityType' => $session->activity_type,
            'status' => $session->status,
            'intensity' => (int) round($intensityScore),
        ];
        broadcast(new \App\Events\TelemetryUpdatedEvent($userId, $telemetryData))->toOthers();

        return response()->json([
            'message' => 'GPS coordinates updated successfully',
            'session' => $session
        ]);
    }

    public function updateSteps(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['error' => 'No active workout session found.'], 404);
        }

        $request->validate([
            'steps'   => 'required|integer|min:0',
            'cadence' => 'nullable|integer|min:0',
        ]);

        $session->update([
            'steps'   => (int) $request->input('steps'),
            'cadence' => $request->input('cadence') !== null ? (int) $request->input('cadence') : $session->cadence,
        ]);

        broadcast(new WorkoutTelemetryUpdated($session, $userId, 'steps'))->toOthers();

        return response()->json([
            'message' => 'Steps updated successfully',
            'session' => $session
        ]);
    }

    public function updateActivity(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['error' => 'No active workout session found.'], 404);
        }

        $request->validate([
            'activity_type' => 'required|string',
        ]);

        $session->update([
            'activity_type' => $request->input('activity_type'),
        ]);

        broadcast(new WorkoutTelemetryUpdated($session, $userId, 'activity'))->toOthers();

        return response()->json([
            'message' => 'Activity updated successfully',
            'session' => $session
        ]);
    }

    public function updateHeartRate(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['error' => 'No active workout session found.'], 404);
        }

        $request->validate([
            'heart_rate' => 'required|integer|min:30|max:220',
        ]);

        $hrHistory = $session->heart_rate_history ?? [];
        $hrHistory[] = [
            'bpm' => (int) $request->input('heart_rate'),
            'timestamp' => now()->toIso8601String(),
        ];

        $session->update([
            'heart_rate' => (int) $request->input('heart_rate'),
            'heart_rate_history' => $hrHistory,
        ]);

        broadcast(new WorkoutTelemetryUpdated($session, $userId, 'heart-rate'))->toOthers();

        return response()->json([
            'message' => 'Heart rate updated successfully',
            'session' => $session
        ]);
    }

    public function updateWorkoutStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $action = $request->input('action', 'start');
        $workoutType = $request->input('workout_type', 'run');

        if ($action === 'start') {
            // End any existing active sessions
            WorkoutSession::where('user_id', $userId)->where('status', 'active')->update(['status' => 'completed']);

            $session = WorkoutSession::create([
                'user_id'       => $userId,
                'duration'      => 0,
                'calories'      => 0,
                'sets'          => 0,
                'reps'          => 0,
                'status'        => 'active',
                'workout_type'  => $workoutType,
                'activity_type' => 'idle',
                'gps_path'      => [],
                'heart_rate'    => 70,
                'heart_rate_history' => [],
                'steps'         => 0,
                'distance'      => 0.0,
            ]);

            broadcast(new WorkoutTelemetryUpdated($session, $userId, 'workout'))->toOthers();
            broadcast(new \App\Events\WorkoutSessionEvent($session, 'start'))->toOthers();

            return response()->json([
                'message' => 'Workout started successfully',
                'session' => $session
            ]);
        }

        $session = WorkoutSession::where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['error' => 'No active workout session found.'], 404);
        }

        if ($action === 'pause') {
            $session->update(['status' => 'paused']);
            broadcast(new WorkoutTelemetryUpdated($session, $userId, 'workout'))->toOthers();
            broadcast(new \App\Events\WorkoutSessionEvent($session, 'pause'))->toOthers();
            return response()->json(['message' => 'Workout paused', 'session' => $session]);
        }

        if ($action === 'resume') {
            $session->update(['status' => 'active']);
            broadcast(new WorkoutTelemetryUpdated($session, $userId, 'workout'))->toOthers();
            broadcast(new \App\Events\WorkoutSessionEvent($session, 'resume'))->toOthers();
            return response()->json(['message' => 'Workout resumed', 'session' => $session]);
        }

        if ($action === 'stop') {
            // Finish the workout
            return $this->finish($request, $session->id);
        }

        return response()->json(['error' => 'Invalid action.'], 400);
    }

    public function getTelemetryAnalytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $logs = \App\Models\WorkoutLog::where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        // 1. Daily Steps Chart
        $dailySteps = $logs->where('steps', '>', 0)
            ->groupBy(fn($l) => $l->created_at->format('Y-m-d'))
            ->map(fn($group, $date) => [
                'date' => $date,
                'steps' => $group->sum('steps')
            ])->values();

        // 2. Weekly Reps Chart
        $weeklyReps = $logs->where('reps', '>', 0)
            ->groupBy(fn($l) => $l->created_at->format('Y-\WW'))
            ->map(fn($group, $week) => [
                'week' => $week,
                'reps' => $group->sum('reps')
            ])->values();

        // 3. Calories Burned Trend
        $caloriesTrend = $logs->groupBy(fn($l) => $l->created_at->format('Y-m-d'))
            ->map(fn($group, $date) => [
                'date' => $date,
                'calories' => round($group->sum('calories'))
            ])->values();

        // 4. Exercise Frequency
        $exerciseFrequency = $logs->groupBy('exercise_name')
            ->map(fn($group, $name) => [
                'name' => $name ?? 'General',
                'value' => $group->count()
            ])->values();

        // 5. Workout Consistency
        $workoutConsistency = $logs->groupBy(fn($l) => $l->created_at->format('Y-\WW'))
            ->map(fn($group, $week) => [
                'week' => $week,
                'count' => $group->count()
            ])->values();

        // 6. Distance Progress
        $distanceProgress = $logs->where('distance', '>', 0)
            ->groupBy(fn($l) => $l->created_at->format('Y-m-d'))
            ->map(fn($group, $date) => [
                'date' => $date,
                'distance' => round($group->sum('distance'), 2)
            ])->values();

        // 7. Workout Intensity Graph
        $intensityGraph = $logs->groupBy(fn($l) => $l->created_at->format('Y-m-d'))
            ->map(fn($group, $date) => [
                'date' => $date,
                'intensity' => round($group->map(fn($l) => $l->intensity === 'high' ? 3 : ($l->intensity === 'medium' ? 2 : 1))->avg(), 1)
            ])->values();

        // Overloads & Streaks
        $totalVolume = $logs->sum(fn($l) => $l->reps * 10);
        $prReps = $logs->max('reps') ?? 0;
        $prDistance = $logs->max('distance') ?? 0;
        
        // Streak calculation
        $activeDates = $logs->map(fn($l) => $l->created_at->format('Y-m-d'))->unique()->sort()->values();
        $streak = 0;
        if ($activeDates->isNotEmpty()) {
            $streak = 1;
            for ($i = $activeDates->count() - 1; $i > 0; $i--) {
                $d1 = new \DateTime($activeDates[$i]);
                $d2 = new \DateTime($activeDates[$i - 1]);
                $diff = $d1->diff($d2)->days;
                if ($diff === 1) {
                    $streak++;
                } else if ($diff > 1) {
                    break;
                }
            }
        }

        return response()->json([
            'dailySteps' => $dailySteps,
            'weeklyReps' => $weeklyReps,
            'caloriesTrend' => $caloriesTrend,
            'exerciseFrequency' => $exerciseFrequency,
            'workoutConsistency' => $workoutConsistency,
            'distanceProgress' => $distanceProgress,
            'intensityGraph' => $intensityGraph,
            'streak' => $streak,
            'prReps' => $prReps,
            'prDistance' => $prDistance,
            'totalVolume' => $totalVolume,
        ]);
    }

    public function updateReps(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        $session = WorkoutSession::where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['error' => 'No active workout session found.'], 404);
        }

        $request->validate([
            'exercise_name'   => 'required|string',
            'reps'            => 'required|integer|min:0',
            'duration'        => 'nullable|integer|min:0',
            'intensity'       => 'nullable|string',
            'calories_burned' => 'nullable|numeric',
        ]);

        $exName = $request->input('exercise_name');
        $reps = (int) $request->input('reps');
        $dur = (int) $request->input('duration', 0);
        $intensity = $request->input('intensity', 'medium');
        $cal = (double) $request->input('calories_burned', $reps * 0.5);

        // Save to exercise_sessions table
        $exerciseSession = \App\Models\ExerciseSession::create([
            'user_id'            => $userId,
            'workout_session_id' => $session->id,
            'exercise_name'      => $exName,
            'reps'               => $reps,
            'duration'           => $dur,
            'intensity'          => $intensity,
            'calories_burned'    => $cal,
        ]);

        // Update active session reps
        $session->update([
            'reps' => $session->reps + 1,
            'calories' => $session->calories + $cal
        ]);

        // Broadcast the telemetry update
        $telemetryData = [
            'duration'     => $session->duration,
            'calories'     => $session->calories,
            'steps'        => $session->steps,
            'distance'     => $session->distance,
            'speed'        => $session->speed ?? 0.0,
            'cadence'      => $session->cadence,
            'heartRate'    => $session->heart_rate,
            'activityType' => $session->activity_type,
            'status'       => $session->status,
            'reps'         => $session->reps,
            'exerciseName' => $exName,
        ];

        broadcast(new \App\Events\TelemetryUpdatedEvent($userId, $telemetryData))->toOthers();

        return response()->json([
            'message'          => 'Repetition logged successfully',
            'exercise_session' => $exerciseSession,
            'session'          => $session
        ]);
    }
}
