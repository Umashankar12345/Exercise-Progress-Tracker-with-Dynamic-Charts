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
        $data = $this->progressService->getTimeSeriesData($request->user());
        return response()->json($data);
    }

    public function insights(Request $request)
    {
        // Mock data for AI insights
        $mockWorkoutData = $request->user()->workouts()->latest()->take(5)->get()->toArray();
        $insights = $this->aiService->generateInsights($mockWorkoutData);
        
        return response()->json(['insights' => $insights]);
    }
}
