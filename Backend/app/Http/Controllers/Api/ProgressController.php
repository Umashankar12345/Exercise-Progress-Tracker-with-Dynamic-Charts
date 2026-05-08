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

    public function summary(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'total_workouts' => $user->workouts()->count(),
            'total_volume' => 12500, // Placeholder
            'prs' => 5, // Placeholder
            'streak' => 3 // Placeholder
        ]);
    }

    public function chart(Request $request)
    {
        $data = $this->progressService->getTimeSeriesData($request->user());
        return response()->json($data);
    }

    public function muscles(Request $request)
    {
        // Mock calculation of volume % per muscle group
        return response()->json([
            ['name' => 'Chest', 'percentage' => 30],
            ['name' => 'Back', 'percentage' => 25],
            ['name' => 'Legs', 'percentage' => 45],
        ]);
    }

}
