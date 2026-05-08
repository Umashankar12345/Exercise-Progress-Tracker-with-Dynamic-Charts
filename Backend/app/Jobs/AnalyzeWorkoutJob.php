<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Workout;
use App\Services\AIService;
use Illuminate\Support\Facades\Log;

class AnalyzeWorkoutJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $workout;

    /**
     * Create a new job instance.
     */
    public function __construct(Workout $workout)
    {
        $this->workout = $workout;
    }

    /**
     * Execute the job.
     */
    public function handle(AIService $aiService): void
    {
        Log::info("Analyzing workout ID: {$this->workout->id} in background job.");
        
        // This simulates gathering last 30 days history to pass to AI
        $workoutData = $this->workout->user->workouts()
            ->where('started_at', '>=', now()->subDays(30))
            ->with('workoutExercises.workoutSets')
            ->get()
            ->toArray();
        
        $insights = $aiService->generateInsights($workoutData);
        
        if ($insights) {
            Log::info("Generated AI Insights for User ID: {$this->workout->user_id}", ['insights' => $insights]);
            
            // Cached in Redis for 24h
            \Illuminate\Support\Facades\Cache::store('redis')->put(
                'ai_insights_user_' . $this->workout->user_id,
                $insights,
                now()->addHours(24)
            );
        }
    }
}
