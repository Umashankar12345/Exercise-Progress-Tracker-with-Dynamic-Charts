<?php

namespace App\Services;

class RecoveryService
{
    public function calculate($sleep, $steps, $heartRate)
    {
        $score = 100;

        if ($sleep < 6) {
            $score -= 20;
        }

        if ($heartRate > 95) {
            $score -= 15;
        }

        if ($steps > 15000) {
            $score -= 10;
        }

        return max($score, 0);
    }
}
