<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\AIService;
use Illuminate\Support\Facades\Cache;

class AIController extends Controller
{
    public function __construct(protected AIService $aiService) {}

    /**
     * GET /api/ai/insights
     *
     * Serves cached insights from Redis/DB on page load.
     * Real-time updates arrive via WebSocket (InsightReady event).
     * If no cache exists, returns the AI fallback insights.
     */
    public function insights(Request $request)
    {
        $userId   = $request->user()->id;
        $cacheKey = "insights:{$userId}";

        // 1. Try cache first — populated by AnalyzeWorkoutJob
        $cached = Cache::get($cacheKey);

        if ($cached) {
            return response()->json($cached);
        }

        // 2. No cache — return structured fallback so UI is never empty
        return response()->json($this->aiService->analyzeProgress([]));
    }
}
