<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Services\AI\InsightsService;
use App\Models\AiPrediction;
use App\Models\AIInsight;
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

    /**
     * Retrieve stored AI insights for the user.
     */
    public function getInsights(Request $request): JsonResponse
    {
        $user = $request->user();
        $insights = AIInsight::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'insights' => $insights,
        ]);
    }

    /**
     * Mark a specific AI insight as read.
     */
    public function markInsightRead(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $insight = AIInsight::where('id', $id)->where('user_id', $user->id)->first();
        if (!$insight) {
            return response()->json([
                'status' => 'error',
                'message' => 'Insight not found.',
            ], 404);
        }
        $insight->is_read = true;
        $insight->save();
        return response()->json([
            'status' => 'success',
            'insight' => $insight,
        ]);
    }

    /**
     * Mark all AI insights as read.
     */
    public function markAllInsightsRead(Request $request): JsonResponse
    {
        $user = $request->user();
        AIInsight::where('user_id', $user->id)->update(['is_read' => true]);
        return response()->json([
            'status' => 'success',
            'message' => 'All insights marked as read.',
        ]);
    }

}
