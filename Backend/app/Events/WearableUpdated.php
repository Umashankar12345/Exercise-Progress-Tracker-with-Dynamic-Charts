<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WearableUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    /**
     * Create a new event instance.
     */
    public function __construct($payload)
    {
        $this->payload = $payload;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new Channel('fitness-live');
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs()
    {
        return 'WEARABLE_UPDATED';
    }
}
