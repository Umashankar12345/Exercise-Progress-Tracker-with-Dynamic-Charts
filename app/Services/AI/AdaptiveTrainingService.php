<?php

namespace App\Services\AI;

class AdaptiveTrainingService
{
    /**
     * Return instructions for modifying intensity based on performance completion percentage.
     */
    public function adaptWorkout(int $completionRate): string
    {
        if ($completionRate < 50) {
            return 'decrease_intensity';
        }

        if ($completionRate > 85) {
            return 'increase_intensity';
        }

        return 'maintain';
    }
}
