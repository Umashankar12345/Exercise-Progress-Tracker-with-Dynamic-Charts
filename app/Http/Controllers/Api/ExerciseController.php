<?php

namespace App\Http\Controllers\Api;

use App\Models\Exercise;
use App\Models\WorkoutSet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ExerciseController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Exercise::query();
        
        if ($request->has('muscle_group')) {
            $query->where('muscle_group', $request->muscle_group);
        }
        
        return response()->json($query->get());
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:exercises',
            'muscle_group' => 'required|string',
            'equipment' => 'nullable|string',
        ]);

        $exercise = \App\Models\Exercise::create($validated);
        return response()->json($exercise, 201);
    }

    public function show(\App\Models\Exercise $exercise)
    {
        return response()->json($exercise);
    }

    public function update(\Illuminate\Http\Request $request, \App\Models\Exercise $exercise)
    {
        $exercise->update($request->all());
        return response()->json($exercise);
    }

    public function destroy(\App\Models\Exercise $exercise)
    {
        $exercise->delete();
        return response()->json(null, 204);
    }

    /**
     * GET /api/exercises/{id}/ghost-placeholder
     * Returns the last logged set for ghost overlay in the workout UI.
     */
    public function getGhostPlaceholder(int $exerciseId): JsonResponse
    {
        $userId = Auth::id();

        // exercise_id lives on workout_exercises, so we scope through that pivot.
        $latestSet = WorkoutSet::whereHas('workoutExercise', function ($q) use ($exerciseId, $userId) {
                $q->where('exercise_id', $exerciseId)
                  ->whereHas('workout', function ($wq) use ($userId) {
                      $wq->where('user_id', $userId);
                  });
            })
            ->orderBy('created_at', 'desc')
            ->first(['weight', 'reps', 'type', 'distance', 'duration_seconds']);

        if (!$latestSet) {
            return response()->json(['message' => 'No historical baseline metrics found.'], 404);
        }

        return response()->json([
            'ghost_data'        => $latestSet,
            'calculated_volume' => $latestSet->type === 'strength' ? ($latestSet->weight * $latestSet->reps) : null,
        ]);
    }

    /**
     * GET /api/exercises/{id}/video-embed
     *
     * Returns a safe iframe embed URL for the exercise tutorial.
     * Priority order:
     *   1. exercise.video_embed  (explicit embed URL stored in DB)
     *   2. exercise.youtube_url  (stored YouTube embed URL)
     *   3. Fallback: YouTube search embed for the exercise name
     */
    public function getVideoEmbed(int $id): JsonResponse
    {
        $exercise = Exercise::findOrFail($id);

        $embedUrl = $this->resolveEmbedUrl($exercise);

        return response()->json([
            'exercise_id' => $exercise->id,
            'name'        => $exercise->name,
            'embed_url'   => $embedUrl,
            'is_fallback' => !($exercise->video_embed || $exercise->youtube_url),
        ]);
    }

    /**
     * Resolve the best embed URL for an exercise.
     * Falls back to a YouTube search so the modal never shows a broken frame.
     */
    private function resolveEmbedUrl(Exercise $exercise): string
    {
        // 1. Explicit video_embed field
        if (!empty($exercise->video_embed)) {
            return $exercise->video_embed;
        }

        // 2. youtube_url field (already in /embed/ format from seeder)
        if (!empty($exercise->youtube_url)) {
            return $exercise->youtube_url . '?rel=0&modestbranding=1';
        }

        // 3. Secure YouTube search embed fallback — never breaks the modal
        $searchQuery = urlencode($exercise->name . ' proper form tutorial');
        return "https://www.youtube.com/embed?listType=search&list={$searchQuery}&rel=0&modestbranding=1";
    }
}
