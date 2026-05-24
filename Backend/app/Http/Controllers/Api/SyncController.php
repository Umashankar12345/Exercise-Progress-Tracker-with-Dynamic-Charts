<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkSyncRequest;
use App\Models\Workout;
use App\Models\WorkoutSet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SyncController extends Controller
{
    public function bulkSync(BulkSyncRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $userId = Auth::id();
        $syncedWorkoutsCount = 0;

        // Utilize atomic DB transactions to guarantee complete storage sync processing sequence
        DB::beginTransaction();
        try {
            foreach ($validatedData['workouts'] as $workoutData) {
                $workout = Workout::create([
                    'user_id'    => $userId,
                    'name'       => $workoutData['name'],
                    'started_at' => $workoutData['started_at'] ?? now(),
                    'ended_at'   => $workoutData['ended_at'] ?? null,
                    'notes'      => $workoutData['notes'] ?? null,
                ]);

                // Find or create exercise
                $exercise = \App\Models\Exercise::firstOrCreate(
                    ['name' => $workoutData['name']],
                    ['muscle_group' => 'Unknown']
                );

                // Create workout exercise mapping
                $workoutEx = $workout->workoutExercises()->create([
                    'exercise_id' => $exercise->id,
                    'user_id'     => $userId,
                    'notes'       => $workoutData['notes'] ?? null,
                ]);

                foreach ($workoutData['sets'] as $index => $setData) {
                    $workoutEx->workoutSets()->create([
                        'reps'             => $setData['reps'] ?? 0,
                        'weight'           => $setData['weight'] ?? 0,
                        'order'            => $index + 1,
                        'distance'         => $setData['distance'] ?? null,
                        'duration_seconds' => $setData['duration_seconds'] ?? null,
                        'type'             => $setData['type'] ?? 'strength',
                    ]);
                }
                $syncedWorkoutsCount++;
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => "Successfully integrated {$syncedWorkoutsCount} buffered operations to storage layer.",
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Critical error syncing data package templates.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
