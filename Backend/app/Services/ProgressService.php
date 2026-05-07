<?php

namespace App\Services;

use App\Models\User;
use App\Models\ProgressSnapshot;

class ProgressService
{
    /**
     * Build time-series data for a user's progress charts.
     */
    public function getTimeSeriesData(User $user)
    {
        return ProgressSnapshot::where('user_id', $user->id)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($snapshot) {
                return [
                    'date' => $snapshot->date->format('Y-m-d'),
                    'total_volume' => $snapshot->total_volume,
                    'workouts_count' => $snapshot->workouts_count,
                ];
            });
    }
}
