<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Models\AiSession;
use App\Services\AI\AIContextBuilderService;
use App\Services\AI\GeminiService;
use App\Services\AI\JarvisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JarvisController extends Controller
{
    public function __construct(
        protected GeminiService $gemini,
        protected AIContextBuilderService $contextBuilder,
        protected JarvisService $jarvis
    ) {}

    /**
     * Generate custom workout program split.
     */
    public function generateWorkout(Request $request): JsonResponse
    {
        $request->validate([
            'goals' => 'nullable|string|max:255',
            'experience' => 'nullable|string|in:beginner,intermediate,advanced',
            'frequency' => 'nullable|string|max:50',
        ]);

        $user = $request->user();
        $split = $this->jarvis->generateWorkoutPlan($user, $request->only(['goals', 'experience', 'frequency']));

        return response()->json([
            'status' => 'success',
            'workout_plan' => $split,
        ]);
    }

    /**
     * Generate target macros and meal structures.
     */
    public function generateNutrition(Request $request): JsonResponse
    {
        $request->validate([
            'weight_kg' => 'required|numeric|min:30|max:300',
            'height_cm' => 'required|numeric|min:100|max:250',
            'age' => 'required|integer|min:10|max:100',
            'goal' => 'required|string|in:cutting,bulking,recomp,maintenance',
            'activity_level' => 'nullable|string|in:sedentary,lightly_active,moderately_active,very_active',
        ]);

        $user = $request->user();
        $mealPlan = $this->jarvis->generateMealPlan($user, $request->all());

        return response()->json([
            'status' => 'success',
            'nutrition_plan' => $mealPlan,
        ]);
    }

    /**
     * Realtime chatbot with memories and context (JSON Response).
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:3000',
            'session_id' => 'nullable|integer'
        ]);

        $user = $request->user();

        // Find or create active Jarvis AI session
        $sessionId = $request->session_id;
        $session = null;
        if ($sessionId) {
            $session = AiSession::where('user_id', $user->id)
                ->where('type', 'jarvis')
                ->find($sessionId);
        }

        if (!$session) {
            $session = AiSession::create([
                'user_id' => $user->id,
                'type' => 'jarvis',
                'status' => 'active',
            ]);
        }

        $context = $this->contextBuilder->build($user);

        // Fetch injuries or other memory details from persistent AI Memory
        $memories = $user->aiMemories()->orderBy('importance', 'desc')->get();
        if ($memories->isNotEmpty()) {
            $context['memories'] = $memories->map(fn($m) => [
                'type' => $m->memory_type,
                'content' => $m->content
            ])->toArray();
        }

        $systemInstruction = "
        You are Jarvis AI, an elite fitness coach, bodybuilding expert, recovery specialist, and nutrition strategist.

        Guidelines:
        - Provide structured workout/meal plans and advice.
        - Personalize responses to user fitness stats, goals, injuries, and memory context.
        - Act like a premium, scientific AI trainer with high-intensity motivational tones.
        - Return clean, professional, concise answers (under 6 sentences when possible).
        ";

        $reply = $this->gemini->ask(
            $systemInstruction,
            "USER CONTEXT: " . json_encode($context) . "\n\n" . $request->message,
            $session
        );

        return response()->json([
            'status' => 'success',
            'message' => $reply
        ]);
    }
}
