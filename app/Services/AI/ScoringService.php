<?php

namespace App\Services\AI;

class ScoringService
{
    /**
     * Calculate an overall performance score (0-100).
     */
    public function calculatePerformanceScore(
        int $consistency,
        int $recovery,
        int $intensity
    ): int {
        return intval(
            ($consistency * 0.4)
            + ($recovery * 0.3)
            + ($intensity * 0.3)
        );
    }
}
