<?php

namespace App\Services;

class FatigueService
{
    /**
     * Calculate fatigue score.
     * Heuristic: Volume/1000 + Sleep Deficit + HRV deficit
     */
    public function calculate(float $volume, float $sleep, float $hrv): float
    {
        $fatigue = ($volume / 1000)
            + (8 - $sleep)
            + (100 - $hrv);

        return round($fatigue, 2);
    }
}
