<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use Illuminate\Foundation\Events\Dispatchable;

use Illuminate\Queue\SerializesModels;

class InsightReady implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly array  $insights,
        public readonly string $recommendation,
        public readonly array  $warnings,
        public readonly ?array $nextWorkout,
        public readonly string $generatedAt
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'insight.ready';
    }

    public function broadcastWith(): array
    {
        return [
            'insights'       => $this->insights,
            'recommendation' => $this->recommendation,
            'warnings'       => $this->warnings,
            'next_workout'   => $this->nextWorkout,
            'generated_at'   => $this->generatedAt,
        ];
    }
}
