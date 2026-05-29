<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkoutSession;
use Carbon\Carbon;

class FitnessAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate 31 days of workout data for user_id 1
        for ($i = 30; $i >= 0; $i--) {
            WorkoutSession::create([
                'user_id' => 1,
                'exercise' => 'Bench Press',
                'sets' => rand(3, 5),
                'reps' => rand(8, 12),
                'weight' => rand(40, 90),
                'calories' => rand(200, 600),
                'duration' => rand(30, 90),
                'created_at' => Carbon::now()->subDays($i),
                'updated_at' => Carbon::now()->subDays($i),
            ]);
        }
    }
}
