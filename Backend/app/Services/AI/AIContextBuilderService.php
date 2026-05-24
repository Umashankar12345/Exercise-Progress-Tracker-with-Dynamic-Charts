<?php

namespace App\Services\AI;

use App\Models\User;

class AIContextBuilderService
{
    public function build(User $user): array
    {
        return [
            'goal' => $user->fitness_goal ?? 'Muscle Hypertrophy',
            'experience' => $user->experience_level ?? 'Intermediate',
            'weight' => $user->weight ?? 75.0,
            'height' => $user->height ?? 175.0,
            'injuries' => $user->injuries ?? [],
            'sleep_score' => 82,
            'fatigue_score' => 40,
            'preferred_training' => 'Push Pull Legs',
        ];
    }
}
