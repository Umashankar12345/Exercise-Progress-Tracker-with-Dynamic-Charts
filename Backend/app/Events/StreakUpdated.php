<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StreakUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly int $currentStreak,
        public readonly int $bestStreak,
        public readonly string $updatedAt
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'streak.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'current_streak' => $this->currentStreak,
            'best_streak'    => $this->bestStreak,
            'updated_at'     => $this->updatedAt,
        ];
    }
}
