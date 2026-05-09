<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MuscleBalanceUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int   $userId,
        public readonly array $distribution,
        public readonly ?string $imbalanceWarning
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'muscle.balance.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'distribution'     => $this->distribution,
            'imbalance_warning'=> $this->imbalanceWarning,
        ];
    }
}
