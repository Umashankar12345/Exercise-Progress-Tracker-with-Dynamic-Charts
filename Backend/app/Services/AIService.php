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
    public function generateInsights(array $workoutData): ?array
    {
        if (!$this->apiKey) {
            Log::warning('Anthropic API key is missing. Skipping AI insights generation.');
            return [
                'tip' => 'AI Insights are currently unavailable due to missing API key configuration.',
                'warning' => 'Missing API Key',
                'recommendation' => 'Please set ANTHROPIC_API_KEY in .env'
            ];
        }

        try {
            $prompt = "Analyze this 30-day workout history: " . json_encode($workoutData) . "
Provide a response strictly in valid JSON format with three keys: 'tip', 'warning', and 'recommendation'. Do not include any other text or markdown block wrappers.";

            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-3-haiku-20240307',
                'max_tokens' => 500,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['content'][0]['text'] ?? '{}';
                
                // Clean up in case Claude wraps with ```json
                $text = str_replace(['```json', '```'], '', $text);
                
                return json_decode($text, true) ?: null;
            }
            
            Log::error('Claude API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Claude API Exception: ' . $e->getMessage());
            return null;
        }
    }
}
