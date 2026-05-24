<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkoutLogged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $userId;
    public int $totalWorkouts;
    public float $totalVolume;
    public int $prsCount;
    public bool $incrementInsights;

    /**
     * Create a new event instance.
     */
    public function __construct(int $userId, int $totalWorkouts, float $totalVolume, int $prsCount, bool $incrementInsights = true)
    {
        $this->userId = $userId;
        $this->totalWorkouts = $totalWorkouts;
        $this->totalVolume = $totalVolume;
        $this->prsCount = $prsCount;
        $this->incrementInsights = $incrementInsights;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'WorkoutLogged';
    }

    public function broadcastWith(): array
    {
        return [
            'total_workouts' => $this->totalWorkouts,
            'total_volume' => $this->totalVolume,
            'prs' => $this->prsCount,
            'increment_insights' => $this->incrementInsights,
        ];
    }
}
