<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AICoachReplyReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly string $reply
    ) {}

    /**
     * Broadcast on the user's private Reverb channel.
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    /**
     * Event name the React Echo listener listens to.
     */
    public function broadcastAs(): string
    {
        return 'AICoachReplyReceived';
    }

    public function broadcastWith(): array
    {
        return [
            'reply'      => $this->reply,
            'user_id'    => $this->userId,
            'timestamp'  => now()->toISOString(),
        ];
    }
}
