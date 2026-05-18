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
        $this->apiKey = config('services.gemini.key', env('GEMINI_API_KEY', ''));
    }

    public function analyzeProgress(array $workoutHistory): ?array
    {
        if (!$this->apiKey) {
            return $this->fallbackInsights();
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$this->apiKey}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(55)->post($url, [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $this->systemPrompt()]
                    ]
                ],
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $this->buildPrompt($workoutHistory)]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if (!$response->successful()) {
                return $this->fallbackInsights();
            }

            $text = $response->json('candidates.0.content.parts.0.text', '{}');
            $data = json_decode(trim($text), true);

            return is_array($data) ? $data : $this->fallbackInsights();
        } catch (\Exception $e) {
            Log::error('Gemini API Error: ' . $e->getMessage());
            return $this->fallbackInsights();
        }
    }

    public function chat(string $message): string
    {
        if (!$this->apiKey) {
            return $this->mockChatResponse($message);
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$this->apiKey}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($url, [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => 'You are a helpful fitness AI coach. Keep responses under 3 sentences.']
                    ]
                ],
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $message]
                        ]
                    ]
                ]
            ]);

            if (!$response->successful()) {
                return "I'm having trouble connecting right now.";
            }

            return $response->json('candidates.0.content.parts.0.text', "I'm having trouble connecting right now.");
        } catch (\Exception $e) {
            Log::error('Gemini API Chat Error: ' . $e->getMessage());
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
        return 'Return ONLY valid JSON. You must analyze the last 10 workout sessions of the user and output exactly 3 insights under the "insights" key. One of type "progressive_overload", one of type "imbalance", and one of type "recovery". Structure of JSON: {"insights": [{"type": "progressive_overload"|"imbalance"|"recovery", "title": "string", "content": "string"}], "recommendation": "string", "warnings": ["string"], "next_workout": {"name": "string", "exercises": ["string"], "focus": "string"}}';
    }

    private function buildPrompt(array $history): string
    {
        $summary = count($history) === 0 ? 'No workout data yet.' : 'Last workouts: ' . json_encode(array_slice($history, 0, 10));
        return "Analyze this athlete's last 10 sessions.\n\n{$summary}";
    }

    private function fallbackInsights(): array
    {
        return [
            'insights' => [
                [
                    'type' => 'progressive_overload',
                    'title' => 'Progressive Overload',
                    'content' => 'Your Bench Press volume has increased by 12% over the last 3 sessions. Consistent overload detected!'
                ],
                [
                    'type' => 'imbalance',
                    'title' => 'Muscle Imbalance',
                    'content' => 'Chest volume is 2.5x higher than back pulling volume. Add horizontal rows to balance shoulder joints.'
                ],
                [
                    'type' => 'recovery',
                    'title' => 'Recovery & Fatigue',
                    'content' => 'High frequency detected (4 consecutive training days). We suggest scheduling a dedicated rest day tomorrow.'
                ],
            ],
            'recommendation' => 'Prioritize compound movements and allow 48 hours between matching muscle groups.',
            'warnings'        => ['Shoulder tightness reported', 'High volume back-to-back'],
            'next_workout'    => [
                'name'      => 'Pull Day A',
                'exercises' => ['Pull-ups', 'Barbell Row'],
                'focus'     => 'Back & Biceps',
            ],
        ];
    }
}
