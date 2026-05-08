<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\AIService;
use App\Http\Controllers\Controller;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function insights(Request $request)
    {
        // Mock data for AI insights
        $mockWorkoutData = $request->user()->workouts()->latest()->take(5)->get()->toArray();
        $insights = $this->aiService->generateInsights($mockWorkoutData);
        
        return response()->json(['insights' => $insights]);
    }
}
