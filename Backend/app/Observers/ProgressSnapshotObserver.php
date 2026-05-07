<?php

namespace App\Observers;

use App\Models\Workout;
use App\Models\ProgressSnapshot;
use App\Services\WorkoutService;

class ProgressSnapshotObserver
{
    protected $workoutService;

    public function __construct(WorkoutService $workoutService)
    {
        $this->workoutService = $workoutService;
    }

    /**
     * Handle the Workout "created" event.
     */
    public function created(Workout $workout): void
    {
        $this->updateSnapshot($workout);
    }

    /**
     * Handle the Workout "updated" event.
     */
    public function updated(Workout $workout): void
    {
        $this->updateSnapshot($workout);
    }

    protected function updateSnapshot(Workout $workout)
    {
        $volume = $this->workoutService->calculateVolume($workout);
        $date = $workout->started_at->toDateString();

        $snapshot = ProgressSnapshot::firstOrCreate(
            ['user_id' => $workout->user_id, 'date' => $date],
            ['total_volume' => 0, 'workouts_count' => 0]
        );

        $snapshot->increment('workouts_count');
        $snapshot->total_volume += $volume;
        $snapshot->save();
    }
}
