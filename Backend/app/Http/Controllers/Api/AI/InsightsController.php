<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Services\AI\InsightsService;
use App\Models\AiPrediction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InsightsController extends Controller
{
    public function __construct(protected InsightsService $insights) {}

    /**
     * Compute and output AI workout analytics and progressive overload logs.
     */
    public function analyze(Request $request): JsonResponse
    {
        $user = $request->user();
        $analytics = $this->insights->analyzeWorkoutTelemetry($user);

        return response()->json([
            'status' => 'success',
            'analytics' => $analytics,
        ]);
    }

    /**
     * Retrieve plateau forecasts.
     */
    public function getPlateauPredictions(Request $request): JsonResponse
    {
        $user = $request->user();
        $predictions = AiPrediction::where('user_id', $user->id)
            ->where('type', 'plateau')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'predictions' => $predictions,
        ]);
    }
}
