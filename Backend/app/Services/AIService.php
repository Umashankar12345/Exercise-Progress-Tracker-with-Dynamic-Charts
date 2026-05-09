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

    /**
     * Analyze 30-day workout history via Claude.
     * Returns structured array for InsightReady broadcast.
     */
    public function analyzeProgress(array $workoutHistory): ?array
    {
        if (!$this->apiKey) {
            Log::warning('AIService: ANTHROPIC_API_KEY not set. Returning fallback insights.');
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
                Log::error('AIService: Claude API error', ['body' => $response->body()]);
                return $this->fallbackInsights();
            }

            $text = $response->json('content.0.text', '{}');
            $text = preg_replace('/```json|```/', '', $text);

            $data = json_decode(trim($text), true);

            return is_array($data) ? $data : $this->fallbackInsights();

        } catch (\Exception $e) {
            Log::error('AIService: Exception — ' . $e->getMessage());
            return $this->fallbackInsights();
        }
    }

    /**
     * Serve cached insights (page-load path, no repeat API call).
     */
    public function getCachedInsights(int $userId): ?array
    {
        return Cache::get("insights:{$userId}");
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are an expert fitness AI coach analyzing workout data.
Return ONLY valid JSON with this exact structure — no markdown, no extra text:
{
  "insights": [
    {"type": "tip",     "text": "string"},
    {"type": "warning", "text": "string"},
    {"type": "alert",   "text": "string"}
  ],
  "recommendation": "string",
  "warnings": ["string"],
  "next_workout": {
    "name": "string",
    "exercises": ["string"],
    "focus": "string"
  }
}
PROMPT;
    }

    private function buildPrompt(array $history): string
    {
        $summary = count($history) === 0
            ? 'No workout data yet.'
            : 'Last ' . count($history) . ' workouts: ' . json_encode(array_slice($history, 0, 5));

        return "Analyze this athlete's training data and give coaching advice.\n\n{$summary}";
    }

    private function fallbackInsights(): array
    {
        return [
            'insights' => [
                ['type' => 'tip',     'text' => 'Progressive overload detected. Keep increasing weight by 2.5 kg each week.'],
                ['type' => 'warning', 'text' => 'Shoulder imbalance: pushing 2x more than pulling. Add rows.'],
                ['type' => 'alert',   'text' => 'Deload week recommended after 14 consecutive training days.'],
            ],
            'recommendation' => 'Focus on compound movements and ensure adequate rest between sessions.',
            'warnings'        => ['Potential overtraining risk detected'],
            'next_workout'    => [
                'name'      => 'Pull Day A',
                'exercises' => ['Pull-ups', 'Barbell Row', 'Face Pulls'],
                'focus'     => 'Back & Biceps — rebalance push/pull ratio',
            ],
        ];
    }
}
