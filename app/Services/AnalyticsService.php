<?php

namespace App\Services;

use App\Models\Workout;
use Illuminate\Support\Facades\Cache;

class AnalyticsService
{
    /**
     * Get aggregate dashboard stats for the user.
     */
    public function dashboard($userId)
    {
        return Cache::remember(
            "dashboard_{$userId}",
            60,
            function () use ($userId) {
                $workouts = Workout::where('user_id', $userId)
                    ->with('workoutExercises.workoutSets')
                    ->get();

                return [
                    'total_workouts' => $workouts->count(),
                    'total_volume' => $workouts->sum(fn($w) => $w->volume),
                    'total_calories' => $workouts->sum('calories_burned') ?: $workouts->sum('calories'),
                    'avg_duration' => $workouts->avg('duration') ?? 0,
                    'weekly_progress' => $this->weeklyProgress($userId),
                ];
            }
        );
    }

    /**
     * Compile volume changes over the past week.
     */
    private function weeklyProgress($userId)
    {
        $workouts = Workout::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(7))
            ->with('workoutExercises.workoutSets')
            ->get();

        $progress = [];
        foreach ($workouts as $workout) {
            $date = $workout->created_at->toDateString();
            if (!isset($progress[$date])) {
                $progress[$date] = 0;
            }
            $progress[$date] += $workout->volume;
        }

        $formatted = [];
        foreach ($progress as $date => $volume) {
            $formatted[] = [
                'date' => $date,
                'volume' => $volume,
            ];
        }

        // Return sorted by date
        usort($formatted, fn($a, $b) => strcmp($a['date'], $b['date']));

        return $formatted;
    }
}
