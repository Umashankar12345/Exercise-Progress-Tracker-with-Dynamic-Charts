<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $challenges = [
            [
                'id' => 1,
                'title' => 'Global 100K Steps',
                'description' => 'Burn calories and build stamina by hitting 100,000 total steps.',
                'type' => 'steps',
                'goal_amount' => 100000,
                'xp_reward' => 500,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => '30-Day HIIT Burn',
                'description' => 'Perform 10 high-intensity workouts to spike your metabolism.',
                'type' => 'workouts',
                'goal_amount' => 10,
                'xp_reward' => 750,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'title' => 'Iron Mastery',
                'description' => 'Log 15 weight training workouts and master the iron.',
                'type' => 'workouts',
                'goal_amount' => 15,
                'xp_reward' => 1000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'title' => 'Cardio Crusader',
                'description' => 'Hit 50,000 steps of jogging and running this month.',
                'type' => 'steps',
                'goal_amount' => 50000,
                'xp_reward' => 400,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($challenges as $challenge) {
            \App\Models\Challenge::updateOrCreate(['id' => $challenge['id']], $challenge);
        }
    }
}
