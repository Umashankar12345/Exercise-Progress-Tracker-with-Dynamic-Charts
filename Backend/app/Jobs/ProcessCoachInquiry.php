<?php

namespace App\Jobs;

use App\Events\AICoachReplyReceived;
use App\Models\Workout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessCoachInquiry implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int Max retries before marking as failed */
    public int $tries = 2;

    /** @var int Seconds before the job is considered timed out */
    public int $timeout = 45;

    public function __construct(
        private readonly int    $userId,
        private readonly string $prompt,
        private readonly array  $history = []
    ) {}

    public function handle(): void
    {
        Log::info("ProcessCoachInquiry: starting for user {$this->userId}");

        $apiKey = config('services.gemini.key', env('GEMINI_API_KEY', ''));

        if (!$apiKey) {
            Log::error('ProcessCoachInquiry: GEMINI_API_KEY is not configured.');
            $this->broadcastReply('AI Configuration key missing on server.');
            return;
        }

        // ── 1. Chunk & summarise last 20 workout sets for context ──────────
        $workoutSummary = [];
        Workout::with(['workoutExercises.workoutSets', 'workoutExercises.exercise'])
            ->where('user_id', $this->userId)
            ->latest()
            ->limit(10)
            ->get()
            ->each(function (Workout $workout) use (&$workoutSummary) {
                foreach ($workout->workoutExercises as $we) {
                    foreach ($we->workoutSets as $set) {
                        $workoutSummary[] = [
                            'date'     => $workout->created_at->toDateString(),
                            'exercise' => $we->exercise?->name ?? 'Unknown',
                            'reps'     => $set->reps,
                            'weight'   => $set->weight,
                            'type'     => $set->type ?? 'strength',
                        ];
                    }
                }
            });

        // ── 2. Build multi-turn conversation contents ───────────────────────
        $systemInstruction = 'You are FitTrack AI Coach. You have precision high analysis. '
            . 'Keep answers concise, factual, and focused strictly on progressive overload and kinesiology. '
            . 'You have access to the user\'s recent workout data below — use it to personalise your response.';

        if (!empty($workoutSummary)) {
            $systemInstruction .= "\n\nRecent workout data (last 10 sessions):\n"
                . json_encode(array_slice($workoutSummary, 0, 40));
        }

        $contents = [];

        // Inject prior conversation turns
        foreach ($this->history as $entry) {
            if (!empty($entry['role']) && !empty($entry['text'])) {
                $contents[] = [
                    'role'  => $entry['role'] === 'user' ? 'user' : 'model',
                    'parts' => [['text' => $entry['text']]],
                ];
            }
        }

        // Append current user prompt (with system context prepended only on first message)
        $userText = empty($this->history)
            ? $systemInstruction . "\n\nUser Question: " . $this->prompt
            : $this->prompt;

        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $userText]],
        ];

        // ── 3. Call Gemini via Centralized Service ──────────────────────────
        try {
            $gemini = app(\App\Services\AI\GeminiService::class);
            
            // Format current prompt to include history if necessary
            $userText = $this->prompt;
            
            $reply = $gemini->ask($systemInstruction, $userText);

            $this->broadcastReply($reply);
            Log::info("ProcessCoachInquiry: reply broadcast for user {$this->userId}");

        } catch (\Exception $e) {
            Log::critical('ProcessCoachInquiry: Exception - ' . $e->getMessage());
            $this->broadcastReply('Internal sync processing loop halted. Please try again.');
        }
    }

    private function broadcastReply(string $reply): void
    {
        AICoachReplyReceived::dispatch($this->userId, $reply);
    }

    public function failed(\Throwable $e): void
    {
        Log::error("ProcessCoachInquiry: all retries exhausted for user {$this->userId}", [
            'error' => $e->getMessage(),
        ]);
        AICoachReplyReceived::dispatch($this->userId, 'Coach is temporarily unavailable. Please try again shortly.');
    }
}
