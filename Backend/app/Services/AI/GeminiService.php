<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\AiMessage;
use App\Models\AiSession;

class GeminiService
{
    protected string $apiKey = '';
    protected string $model = 'gemini-2.5-flash';

    public function __construct()
    {
        $this->apiKey = (string) env('GEMINI_API_KEY', config('services.gemini.key', ''));
    }

    protected function getVerifyOption()
    {
        $verify = true;
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $certPath = storage_path('app/cacert.pem');
            if (!file_exists($certPath)) {
                // Ensure storage/app exists
                if (!is_dir(storage_path('app'))) {
                    mkdir(storage_path('app'), 0755, true);
                }
                @file_put_contents($certPath, @file_get_contents('https://curl.se/ca/cacert.pem', false, stream_context_create([
                    "ssl" => [
                        "verify_peer" => false,
                        "verify_peer_name" => false,
                    ]
                ])));
            }
            if (file_exists($certPath) && filesize($certPath) > 0) {
                $verify = $certPath;
            }
        }
        return $verify;
    }

    /**
     * Send chat prompt with session memory support.
     */
    public function ask(
        string $systemInstruction,
        string $userPrompt,
        AiSession $session = null,
        array $generationConfig = []
    ): string {
        if (empty($this->apiKey)) {
            Log::warning('[GeminiService]: Gemini API key is missing. Using fallback response mode.');
            throw new \Exception('Gemini API key is not configured.');
        }

        // Format contents including session memory history
        $contents = [];
        if ($session) {
            $history = $session->messages()
                ->orderBy('created_at', 'asc')
                ->take(12) // Keep last 12 messages for context window bounds
                ->get();

            foreach ($history as $msg) {
                $contents[] = [
                    'role' => $msg->role === 'user' ? 'user' : 'model',
                    'parts' => [['text' => $msg->content]]
                ];
            }
        }

        // Append current prompt
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userPrompt]]
        ];

        // Generation configuration merging
        $defaultConfig = [
            'temperature' => 0.4,
            'topP' => 0.95,
            'maxOutputTokens' => 1024,
        ];
        $mergedConfig = array_merge($defaultConfig, $generationConfig);

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        // Retry loop to handle rate limit (429) or connection hiccups
        $maxRetries = 3;
        $attempt = 0;
        $lastException = null;

        while ($attempt < $maxRetries) {
            try {
                $attempt++;
                $response = Http::withOptions(['verify' => $this->getVerifyOption()])
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->timeout(30)
                    ->post($url, [
                        'systemInstruction' => [
                            'parts' => [['text' => $systemInstruction]]
                        ],
                        'contents' => $contents,
                        'generationConfig' => $mergedConfig
                    ]);

                if ($response->successful()) {
                    $responseText = $response->json('candidates.0.content.parts.0.text', '');
                    if (empty($responseText)) {
                        throw new \Exception('Empty reply returned from Gemini API.');
                    }
                    
                    // Save history if session is present
                    if ($session) {
                        // User message
                        $session->messages()->create([
                            'role' => 'user',
                            'content' => $userPrompt,
                        ]);
                        // Model reply
                        $session->messages()->create([
                            'role' => 'assistant',
                            'content' => $responseText,
                        ]);
                    }

                    return $responseText;
                }

                if ($response->status() === 429) {
                    $sleepTime = pow(2, $attempt);
                    Log::warning("[GeminiService] Rate limited (429). Retrying in {$sleepTime}s...");
                    sleep($sleepTime);
                    continue;
                }

                throw new \Exception("Gemini API returned status {$response->status()}: " . $response->body());

            } catch (\Exception $e) {
                Log::error("[GeminiService] Attempt {$attempt} failed: " . $e->getMessage());
                $lastException = $e;
                
                // Sleep briefly before retrying
                usleep(500000); 
            }
        }

        throw new \Exception("Gemini API call failed after {$maxRetries} attempts. Last error: " . ($lastException ? $lastException->getMessage() : 'unknown'));
    }

    /**
     * Stream responses using Server-Sent Events (SSE).
     */
    public function streamChat(
        string $systemInstruction,
        string $userPrompt,
        ?AiSession $session = null,
        array $context = []
    ) {
        if (empty($this->apiKey)) {
            Log::warning('[GeminiService]: Gemini API key is missing.');
            throw new \Exception('Gemini API key is not configured.');
        }

        $userId = auth()->id() ?? request()->ip();
        $rateKey = 'gemini-user-' . $userId;

        if (!RateLimiter::attempt($rateKey, 30, fn() => true)) {
            Log::warning("[GeminiService] AI rate limit exceeded for user {$userId}");
            throw new \Exception('AI rate limit exceeded');
        }

        $history = [];

        if ($session) {
            $messages = $session->messages()
                ->latest()
                ->take(8)
                ->get()
                ->reverse();

            foreach ($messages as $msg) {
                $history[] = [
                    'role' => $msg->role === 'assistant' ? 'model' : 'user',
                    'parts' => [
                        ['text' => $msg->content]
                    ]
                ];
            }
        }

        $profileContext = json_encode($context);

        $history[] = [
            'role' => 'user',
            'parts' => [[
                'text' => "USER CONTEXT: {$profileContext}\n\n{$userPrompt}"
            ]]
        ];

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:streamGenerateContent?alt=sse&key={$this->apiKey}";

        return response()->stream(function () use ($url, $systemInstruction, $history, $session, $userPrompt) {
            $response = Http::withOptions(['verify' => $this->getVerifyOption()])
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->timeout(120)
            ->withBody(json_encode([
                'systemInstruction' => [
                    'parts' => [[
                        'text' => $systemInstruction
                    ]]
                ],
                'contents' => $history,
                'generationConfig' => [
                    'temperature' => 0.4,
                    'topP' => 0.95,
                    'maxOutputTokens' => 2048
                ]
            ]), 'application/json')
            ->send('POST', $url, [
                'stream' => true,
            ]);

            $body = $response->getBody();
            $buffer = '';
            $fullText = '';

            while (!$body->eof()) {
                $chunk = $body->read(1024);
                $buffer .= $chunk;

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);

                    $line = trim($line);
                    if (str_starts_with($line, 'data: ')) {
                        $dataJson = substr($line, 6);
                        $data = json_decode($dataJson, true);
                        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                        if ($text !== '') {
                            echo $text;
                            $fullText .= $text;
                            ob_flush();
                            flush();
                        }
                    }
                }
            }

            // Save history if session is present and text was generated
            if ($session && !empty($fullText)) {
                $session->messages()->create([
                    'role' => 'user',
                    'content' => $userPrompt,
                ]);
                $session->messages()->create([
                    'role' => 'assistant',
                    'content' => $fullText,
                ]);
            }
        }, 200, [
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
            'Content-Type' => 'text/plain; charset=utf-8'
        ]);
    }
}
