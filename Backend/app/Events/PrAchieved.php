<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrAchieved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly string $exercise,
        public readonly float  $newPr,
        public readonly float  $previousPr,
        public readonly string $achievedAt
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'pr.achieved';
    }

    public function broadcastWith(): array
    {
        return [
            'exercise'    => $this->exercise,
            'new_pr'      => $this->newPr,
            'previous_pr' => $this->previousPr,
            'achieved_at' => $this->achievedAt,
        ];
    }
}
