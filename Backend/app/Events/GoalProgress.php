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
        public readonly float  $pct,           // 0.0 – 100.0
        public readonly float  $currentKg,     // latest logged weight
        public readonly float  $targetKg,      // goal target weight
        public readonly string $exerciseName,
        public readonly string $status,        // 'in_progress' | 'achieved' | 'overdue'
        public readonly ?string $achievedAt    // ISO timestamp if just hit 100%
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'goal.progress';   // React: .listen('.goal.progress', ...)
    }

    /**
     * Exact JSON the React progress bars receive.
     */
    public function broadcastWith(): array
    {
        return [
            'goal_id'       => $this->goalId,
            'pct'           => $this->pct,
            'current_kg'    => $this->currentKg,
            'target_kg'     => $this->targetKg,
            'exercise_name' => $this->exerciseName,
            'status'        => $this->status,
            'achieved_at'   => $this->achievedAt,
        ];
    }
}
