<?php

namespace App\Services;

use App\Services\AI\GeminiService;
use Illuminate\Support\Facades\Log;

class AICoachService
{
    public function __construct(protected GeminiService $gemini) {}

    /**
     * Generate advanced workout coaching tips based on user analytics.
     */
    public function generate($user, $analytics)
    {
        $systemInstruction = "You are an elite AI fitness coach. Provide advanced, action-oriented workout and recovery coaching based on the athlete's metrics.";

        $prompt = "
        User Fatigue: " . ($analytics['fatigue'] ?? 30) . "
        Sleep: " . ($analytics['sleep'] ?? 7.5) . " hours
        Calories Burned: " . ($analytics['calories'] ?? 400) . "
        Goal: " . ($user->fitness_goal ?? 'Muscle Gain') . "

        Generate advanced workout coaching. Keep it under 4 sentences.
        ";

        try {
            return $this->gemini->ask($systemInstruction, $prompt);
        } catch (\Exception $e) {
            Log::error('[AICoachService] Generation failed: ' . $e->getMessage());
            return "Keep training hard, focus on high-quality sets, and prioritize sleeping 8 hours tonight.";
        }
    }
}
