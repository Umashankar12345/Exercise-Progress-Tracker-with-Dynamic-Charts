<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AiResponseChunk implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sessionId;
    public $chunk;

    /**
     * Create a new event instance.
     *
     * @param int|null $sessionId  The AI session ID (or null if not using sessions)
     * @param string   $chunk      The text chunk to send to the client
     */
    public function __construct(?int $sessionId, string $chunk)
    {
        $this->sessionId = $sessionId;
        $this->chunk = $chunk;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        // Private channel for the authenticated user
        return [new PrivateChannel('private-user.' . auth()->id())];
    }

    /**
     * Data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'session_id' => $this->sessionId,
            'chunk' => $this->chunk,
        ];
    }
}
?>
