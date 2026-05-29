<?php

namespace App\Services;

class CalorieService
{
    /**
     * Calculate calories burned.
     * Formula: Calories = 0.0175 * MET * Weight (kg) * Minutes
     */
    public function calculate(float $met, float $weight, float $minutes): float
    {
        return 0.0175 * $met * $weight * $minutes;
    }
}
