<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGoalRequest;
use App\Models\Goal;
use App\Services\GoalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function __construct(private GoalService $goalService) {}

    /**
     * GET /api/goals
     * Returns all active goals with live % — used on page load.
     * After this, GoalProgress WebSocket events keep % up to date.
     */
    public function index(Request $request): JsonResponse
    {
        $goals = $this->goalService->allGoalsProgress($request->user()->id);

        return response()->json([
            'data' => $goals,
        ]);
    }

    /**
     * POST /api/goals
     * Create a new goal — validates exercise_id, target_kg and target_date.
     */
    public function store(StoreGoalRequest $request): JsonResponse
    {
        $goal = Goal::create([
            'user_id'     => $request->user()->id,
            'exercise_id' => $request->exercise_id,
            'target_kg'   => $request->target_kg,
            'target_date' => $request->target_date,
        ]);

        $progress = $this->goalService->calcPercent(
            $goal->load('exercise'),
            $request->user()->id
        );

        return response()->json(['data' => $progress], 201);
    }

    /**
     * GET /api/goals/{goal}
     */
    public function show(Goal $goal): JsonResponse
    {
        return response()->json($goal);
    }

    /**
     * PUT /api/goals/{goal}
     * Update target — recalculate progress immediately.
     */
    public function update(Request $request, Goal $goal): JsonResponse
    {
        $this->authorize('delete', $goal); // reuse ownership check
        $goal->update($request->only(['target_kg', 'target_date']));

        $progress = $this->goalService->calcPercent(
            $goal->fresh()->load('exercise'),
            $request->user()->id
        );

        return response()->json(['data' => $progress]);
    }

    /**
     * DELETE /api/goals/{goal}
     * Remove a goal — policy ensures user owns it.
     */
    public function destroy(Goal $goal): JsonResponse
    {
        $this->authorize('delete', $goal);
        $goal->delete();
        return response()->json(['message' => 'Goal removed.']);
    }
}
