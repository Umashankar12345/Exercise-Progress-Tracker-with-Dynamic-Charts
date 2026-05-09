<?php

namespace App\Jobs;

use App\Events\InsightReady;
use App\Services\AIService;
use App\Models\Workout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AnalyzeWorkoutJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;   // retry up to 3 times on Claude failure
    public int $timeout = 60;  // Claude API can be slow

    public function __construct(
        private readonly int $userId
    ) {}

    public function handle(AIService $aiService): void
    {
        Log::info("AnalyzeWorkoutJob: starting for user {$this->userId}");

        // 1. Build 30-day workout history
        $history = Workout::with(['workoutExercises.workoutSets'])
            ->where('user_id', $this->userId)
            ->where('started_at', '>=', now()->subDays(30))
            ->latest()
            ->get()
            ->toArray();

        // 2. Call Claude and parse response
        $result = $aiService->analyzeProgress($history);

        if (!$result) {
            Log::warning("AnalyzeWorkoutJob: no result for user {$this->userId}");
            return;
        }

        // 3. Cache for 24 hours — served on page load (no redundant API call)
        Cache::put(
            "insights:{$this->userId}",
            $result,
            now()->addHours(24)
        );

        // 4. Broadcast live via Reverb WebSocket → user's private channel
        InsightReady::dispatch(
            userId:         $this->userId,
            insights:       $result['insights']       ?? [],
            recommendation: $result['recommendation'] ?? '',
            warnings:       $result['warnings']       ?? [],
            nextWorkout:    $result['next_workout']   ?? null,
            generatedAt:    now()->toISOString()
        );

        Log::info("AnalyzeWorkoutJob: InsightReady broadcast for user {$this->userId}");
    }

    /**
     * Clear stale cache if all retries fail.
     */
    public function failed(\Throwable $e): void
    {
        Cache::forget("insights:{$this->userId}");
        Log::error("AnalyzeWorkoutJob failed for user {$this->userId}", [
            'error' => $e->getMessage(),
        ]);
    }
}
