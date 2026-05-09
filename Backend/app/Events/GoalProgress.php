<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GoalProgress implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly int    $goalId,
        public readonly float  $percentage,
        public readonly bool   $isAchieved,
        public readonly string $updatedAt
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'goal.progress';
    }

    public function broadcastWith(): array
    {
        return [
            'goal_id'    => $this->goalId,
            'percentage' => $this->percentage,
            'achieved'   => $this->isAchieved,
            'updated_at' => $this->updatedAt,
        ];
    }
}
