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
        
        // This simulates gathering all recent workouts to pass to AI
        $workoutData = $this->workout->user->workouts()->with('workoutExercises.workoutSets')->latest()->take(3)->get()->toArray();
        
        $insights = $aiService->generateInsights($workoutData);
        
        if ($insights) {
            Log::info("Generated AI Insights for User ID: {$this->workout->user_id}", ['insights' => $insights]);
            // In a real app, you would save these insights to the database or notify the user
        }
    }
}
