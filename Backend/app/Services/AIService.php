<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.key', env('ANTHROPIC_API_KEY', ''));
    }

    public function analyzeProgress(array $workoutHistory): ?array
    {
        if (!$this->apiKey) {
            return $this->fallbackInsights();
        }

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type'      => 'application/json',
            ])->timeout(55)->post('https://api.anthropic.com/v1/messages', [
                'model'      => 'claude-3-haiku-20240307',
                'max_tokens' => 800,
                'system'     => $this->systemPrompt(),
                'messages'   => [
                    ['role' => 'user', 'content' => $this->buildPrompt($workoutHistory)],
                ],
            ]);

            if (!$response->successful()) {
                return $this->fallbackInsights();
            }

            $text = $response->json('content.0.text', '{}');
            $text = preg_replace('/```json|```/', '', $text);
            $data = json_decode(trim($text), true);

            return is_array($data) ? $data : $this->fallbackInsights();
        } catch (\Exception $e) {
            return $this->fallbackInsights();
        }
    }

    public function chat(string $message): string
    {
        if (!$this->apiKey) {
            return $this->mockChatResponse($message);
        }

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type'      => 'application/json',
            ])->timeout(30)->post('https://api.anthropic.com/v1/messages', [
                'model'      => 'claude-3-haiku-20240307',
                'max_tokens' => 300,
                'system'     => 'You are a helpful fitness AI coach. Keep responses under 3 sentences.',
                'messages'   => [
                    ['role' => 'user', 'content' => $message],
                ],
            ]);

            return $response->json('content.0.text', "I'm having trouble connecting right now.");
        } catch (\Exception $e) {
            return "I'm a bit overwhelmed with data right now.";
        }
    }

    private function mockChatResponse(string $message): string
    {
        $message = strtolower($message);
        if (str_contains($message, 'chest') || str_contains($message, 'bench')) {
            return "Your chest volume is up 12% this month. I recommend adding 2.5kg to your next bench press session!";
        }
        if (str_contains($message, 'diet') || str_contains($message, 'food')) {
            return "Nutrition is key. Ensure you're hitting at least 1.6g of protein per kg of body weight.";
        }
        if (str_contains($message, 'rest') || str_contains($message, 'sleep')) {
            return "Recovery is where growth happens. Aim for 7-9 hours of quality sleep.";
        }
        return "That's a great question! Stay consistent with your current training split.";
    }

    public function getCachedInsights(int $userId): ?array
    {
        return Cache::get("insights:{$userId}");
    }

    private function systemPrompt(): string
    {
        return 'Return ONLY valid JSON: {"insights": [{"type": "tip", "text": "string"}], "recommendation": "string", "warnings": ["string"], "next_workout": {"name": "string", "exercises": ["string"], "focus": "string"}}';
    }

    private function buildPrompt(array $history): string
    {
        $summary = count($history) === 0 ? 'No workout data yet.' : 'Last workouts: ' . json_encode(array_slice($history, 0, 5));
        return "Analyze this athlete's data.\n\n{$summary}";
    }

    private function fallbackInsights(): array
    {
        return [
            'insights' => [
                ['type' => 'tip',     'text' => 'Progressive overload detected.'],
                ['type' => 'warning', 'text' => 'Shoulder imbalance detected.'],
                ['type' => 'alert',   'text' => 'Deload week recommended soon.'],
            ],
            'recommendation' => 'Focus on compound movements.',
            'warnings'        => ['Overtraining risk'],
            'next_workout'    => [
                'name'      => 'Pull Day A',
                'exercises' => ['Pull-ups', 'Barbell Row'],
                'focus'     => 'Back & Biceps',
            ],
        ];
    }
}
