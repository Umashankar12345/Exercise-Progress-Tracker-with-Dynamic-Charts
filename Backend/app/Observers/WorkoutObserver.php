<?php

namespace App\Observers;

use App\Models\Workout;
use App\Jobs\AnalyzeWorkoutJob;

class WorkoutObserver
{
    /**
     * Handle the Workout "created" event.
     */
    public function created(Workout $workout): void
    {
        // Dispatch AI analysis job after workout is logged
        // AnalyzeWorkoutJob::dispatch($workout->user);
    }

    /**
     * Handle the Workout "updated" event.
     */
    public function updated(Workout $workout): void
    {
        //
    }

    /**
     * Handle the Workout "deleted" event.
     */
    public function deleted(Workout $workout): void
    {
        //
    }
}
