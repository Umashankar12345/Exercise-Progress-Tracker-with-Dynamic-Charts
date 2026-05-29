<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use App\Services\AI\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function __construct(
        protected AIService $aiService,
        protected GeminiService $gemini
    ) {}

    public function insights(Request $request): JsonResponse
    {
        $userId   = $request->user()->id;
        $cacheKey = "insights:{$userId}";

        $cached = Cache::get($cacheKey);

        if ($cached) {
            return response()->json($cached);
        }

        return response()->json($this->aiService->analyzeProgress([]));
    }

    /**
     * Chat Q&A with AI Coach.
     */
    public function chat(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'message' => 'required|string|max:1000',
            ]);

            $reply = $this->aiService->chat($request->input('message'));

            return response()->json([
                'reply' => $reply,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hackathon demo synchronous endpoint.
     */
    public function ask(Request $request)
    {
        $message = $request->input('message');
        
        try {
            // Use Pollinations AI instead of Gemini
            $prompt = "You are 'Jarvis for Fitness', a high-end AI coach. CRITICAL: Reply in 2 sentences MAXIMUM for extreme speed. You MUST ONLY answer questions related to fitness, health, nutrition, or workouts. If the user asks about ANY other topic, decline and state you are exclusively a fitness coach. User says: " . $message;
            $response = Http::timeout(15)->get('https://text.pollinations.ai/' . urlencode($prompt));
            
            $reply = $response->successful() ? $response->body() : "I am experiencing interference with my neural net (Pollinations API error).";
            
            return response()->json([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => $reply
                                ]
                            ]
                        ]
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
