<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected $apiKey;
    
    public function __construct()
    {
        $this->apiKey = config('services.anthropic.key', env('ANTHROPIC_API_KEY'));
    }

    /**
     * Sends workout history to Claude API and parses the response.
     */
    public function generateInsights(array $workoutData): ?string
    {
        if (!$this->apiKey) {
            Log::warning('Anthropic API key is missing. Skipping AI insights generation.');
            return "AI Insights are currently unavailable due to missing API key configuration.";
        }

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-3-haiku-20240307',
                'max_tokens' => 500,
                'messages' => [
                    ['role' => 'user', 'content' => 'Analyze this workout data and provide a concise tip: ' . json_encode($workoutData)]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['content'][0]['text'] ?? null;
            }
            
            Log::error('Claude API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Claude API Exception: ' . $e->getMessage());
            return null;
        }
    }
}
