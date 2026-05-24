<?php

namespace App\Services\AI;

class BiomechanicsService
{
    /**
     * Calculate angle between lines AB and CB.
     * a, b, c are arrays of [x, y] coordinates.
     */
    public function calculateAngle(array $a, array $b, array $c): float
    {
        $ab = [
            $a[0] - $b[0],
            $a[1] - $b[1]
        ];

        $cb = [
            $c[0] - $b[0],
            $c[1] - $b[1]
        ];

        $dot = ($ab[0] * $cb[0]) + ($ab[1] * $cb[1]);

        $magAB = sqrt(pow($ab[0], 2) + pow($ab[1], 2));
        $magCB = sqrt(pow($cb[0], 2) + pow($cb[1], 2));

        if (($magAB * $magCB) == 0) {
            return 0.0;
        }

        $cosVal = $dot / ($magAB * $magCB);
        // Ensure within [-1.0, 1.0] domain for acos
        $cosVal = max(-1.0, min(1.0, $cosVal));

        $angle = acos($cosVal);

        return rad2deg($angle);
    }
}
