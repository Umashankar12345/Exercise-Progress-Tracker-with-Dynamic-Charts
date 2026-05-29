<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIFitnessService;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIFitnessService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        $response = $this->aiService->getChatbotResponse(
            $request->user(), 
            $request->message
        );

        return response()->json([
            'reply' => $response
        ]);
    }

    public function generateWorkout(Request $request)
    {
        $request->validate([
            'goals' => 'required|string',
            'fitness_level' => 'required|string'
        ]);

        $workoutData = $this->aiService->generateWorkoutPlan(
            $request->user(),
            $request->goals,
            $request->fitness_level
        );

        return response()->json([
            'workout' => $workoutData
        ]);
    }

    public function getFitnessDNA(Request $request)
    {
        $dna = $this->aiService->generateFitnessDNA($request->user());
        
        return response()->json([
            'dna' => $dna
        ]);
    }
}
