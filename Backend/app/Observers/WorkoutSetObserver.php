<?php

namespace App\Observers;

use App\Models\WorkoutSet;
use Illuminate\Support\Facades\Cache;

class WorkoutSetObserver
{
    /**
     * Handle the WorkoutSet "saved" event (covers created and updated).
     */
    public function saved(WorkoutSet $workoutSet): void
    {
        $this->clearUserCache($workoutSet);
    }

    /**
     * Handle the WorkoutSet "deleted" event.
     */
    public function deleted(WorkoutSet $workoutSet): void
    {
        $this->clearUserCache($workoutSet);
    }

    /**
     * Atomically invalidate user metric caches upon structural data changes.
     */
    private function clearUserCache(WorkoutSet $workoutSet): void
    {
        $userId = $workoutSet->workout->user_id ?? auth()->id();

        if ($userId) {
            // Clears cached dashboard payload chunks instantly
            Cache::forget("user_{$userId}_dashboard_metrics");
        }
    }
}
