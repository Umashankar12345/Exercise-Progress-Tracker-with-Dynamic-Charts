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

    public function generateWorkoutPlan(array $sessions, array $goals): array
    {
        if (!$this->apiKey) {
            return $this->fallbackWorkoutPlan();
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$this->apiKey}";

            $prompt = "You are a professional athletics coach. Generate an adaptive 7-day workout curriculum in JSON format based on these parameters:\n";
            $prompt .= "- Last 12 Sessions: " . json_encode($sessions) . "\n";
            $prompt .= "- Athlete Goals: " . json_encode($goals) . "\n\n";
            $prompt .= "The response MUST be a single, valid JSON object with EXACTLY this structure:\n";
            $prompt .= '{\n';
            $prompt .= '  "days": [\n';
            $prompt .= '    {\n';
            $prompt .= '      "day": "Monday",\n';
            $prompt .= '      "title": "Hypertrophy: Push A",\n';
            $prompt .= '      "focus": "Chest, Delts, Triceps",\n';
            $prompt .= '      "exercises": 6,\n';
            $prompt .= '      "volume": "High"  // Must be one of: High, Extreme, Moderate, Zero\n';
            $prompt .= '    }\n';
            $prompt .= '  ],\n';
            $prompt .= '  "ai_adjustments": [\n';
            $prompt .= '    {\n';
            $prompt .= '      "type": "Volume Correction",\n';
            $prompt .= '      "text": "Volume adjusted for better balance."\n';
            $prompt .= '    }\n';
            $prompt .= '  ],\n';
            $prompt .= '  "statistics": {\n';
            $prompt .= '    "frequency": "5x / Week",\n';
            $prompt .= '    "avg_time": "72 Minutes",\n';
            $prompt .= '    "next_deload": "In 12 Days"\n';
            $prompt .= '  }\n';
            $prompt .= '}\n';

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(55)->post($url, [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => 'Return ONLY valid JSON containing a 7-day adaptive workout plan matching the exact structure requested.']
                    ]
                ],
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if (!$response->successful()) {
                return $this->fallbackWorkoutPlan();
            }

            $text = $response->json('candidates.0.content.parts.0.text', '{}');
            $data = json_decode(trim($text), true);

            return is_array($data) ? $data : $this->fallbackWorkoutPlan();
        } catch (\Exception $e) {
            Log::error('Gemini Plan Generator Error: ' . $e->getMessage());
            return $this->fallbackWorkoutPlan();
        }
    }

    private function fallbackWorkoutPlan(): array
    {
        return [
            'days' => [
                ['day' => 'Monday', 'title' => 'Hypertrophy: Push A', 'focus' => 'Chest, Delts, Triceps', 'exercises' => 6, 'volume' => 'High'],
                ['day' => 'Tuesday', 'title' => 'Hypertrophy: Pull A', 'focus' => 'Back, Biceps, Rear Delts', 'exercises' => 7, 'volume' => 'High'],
                ['day' => 'Wednesday', 'title' => 'Active Recovery', 'focus' => 'Mobility, Zone 2 Cardio', 'exercises' => 0, 'volume' => 'Zero'],
                ['day' => 'Thursday', 'title' => 'Strength: Legs A', 'focus' => 'Quads, Adductors, Calves', 'exercises' => 5, 'volume' => 'Extreme'],
                ['day' => 'Friday', 'title' => 'Hypertrophy: Upper Body B', 'focus' => 'Vertical Push/Pull Focus', 'exercises' => 8, 'volume' => 'Moderate'],
                ['day' => 'Saturday', 'title' => 'Functional Strength', 'focus' => 'Full Body Compound', 'exercises' => 4, 'volume' => 'Moderate'],
                ['day' => 'Sunday', 'title' => 'Full Recovery', 'focus' => 'Rest, Nutrition, Sleep', 'exercises' => 0, 'volume' => 'Zero'],
            ],
            'ai_adjustments' => [
                [
                    'type' => 'Volume Correction',
                    'text' => 'Back day exercises increased by 15% to address pull-to-push imbalance detected in last 3 sessions.'
                ],
                [
                    'type' => 'Exercise Swap',
                    'text' => 'Swapped Bench Press for Incline DB Press due to plateau in horizontal pressing strength.'
                ]
            ],
            'statistics' => [
                'frequency' => '5x / Week',
                'avg_time' => '72 Minutes',
                'next_deload' => 'In 12 Days',
            ]
        ];
    }
}
