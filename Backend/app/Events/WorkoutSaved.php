<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkoutSaved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly int    $workoutId,
        public readonly string $workoutName,
        public readonly int    $totalSets,
        public readonly float  $totalVolume,
        public readonly string $savedAt
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'workout.saved';
    }

    public function broadcastWith(): array
    {
        return [
            'workout_id'   => $this->workoutId,
            'name'         => $this->workoutName,
            'total_sets'   => $this->totalSets,
            'total_volume' => $this->totalVolume,
            'saved_at'     => $this->savedAt,
        ];
    }
}
