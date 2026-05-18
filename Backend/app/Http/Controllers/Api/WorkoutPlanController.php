<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutPlan;
use App\Models\Workout;
use App\Models\Goal;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutPlanController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function getPlan()
    {
        $plan = WorkoutPlan::where('user_id', Auth::id())->latest()->first();

        if (!$plan) {
            return $this->regeneratePlan();
        }

        return response()->json($plan->plan_json);
    }

    public function regeneratePlan()
    {
        $sessions = Workout::where('user_id', Auth::id())
            ->with(['workoutExercises.exercise', 'workoutExercises.workoutSets'])
            ->latest()
            ->limit(12)
            ->get()
            ->toArray();

        $goals = Goal::where('user_id', Auth::id())->get()->toArray();

        $planData = $this->aiService->generateWorkoutPlan($sessions, $goals);

        $plan = WorkoutPlan::create([
            'user_id' => Auth::id(),
            'plan_json' => $planData,
        ]);

        return response()->json($planData);
    }
}
