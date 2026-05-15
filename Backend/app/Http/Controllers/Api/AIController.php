<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AIService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class AIController extends Controller
{
    public function __construct(protected AIService $aiService) {}

    public function insights(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $cacheKey = "insights:{$userId}";

        $cached = Cache::get($cacheKey);

        if ($cached) {
            return response()->json($cached);
        }

        return response()->json($this->aiService->analyzeProgress([]));
    }

    public function chat(Request $request): JsonResponse
    {
        $request->validate(['message' => 'required|string|max:500']);
        
        $reply = $this->aiService->chat($request->message);

        return response()->json([
            'reply' => $reply,
        ]);
    }
}
