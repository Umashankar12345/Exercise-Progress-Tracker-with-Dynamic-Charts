<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        $exercises = [
            ['name' => 'Bench Press', 'muscle_group' => 'Chest', 'equipment' => 'Barbell'],
            ['name' => 'Incline Dumbbell Press', 'muscle_group' => 'Chest', 'equipment' => 'Dumbbell'],
            ['name' => 'Push-ups', 'muscle_group' => 'Chest', 'equipment' => 'Bodyweight'],
            ['name' => 'Cable Crossover', 'muscle_group' => 'Chest', 'equipment' => 'Cable'],
            ['name' => 'Pull-ups', 'muscle_group' => 'Back', 'equipment' => 'Bodyweight'],
            ['name' => 'Barbell Row', 'muscle_group' => 'Back', 'equipment' => 'Barbell'],
            ['name' => 'Lat Pulldown', 'muscle_group' => 'Back', 'equipment' => 'Cable'],
            ['name' => 'Seated Cable Row', 'muscle_group' => 'Back', 'equipment' => 'Cable'],
            ['name' => 'Overhead Press', 'muscle_group' => 'Shoulders', 'equipment' => 'Barbell'],
            ['name' => 'Lateral Raises', 'muscle_group' => 'Shoulders', 'equipment' => 'Dumbbell'],
            ['name' => 'Front Raises', 'muscle_group' => 'Shoulders', 'equipment' => 'Dumbbell'],
            ['name' => 'Barbell Squat', 'muscle_group' => 'Legs', 'equipment' => 'Barbell'],
            ['name' => 'Leg Press', 'muscle_group' => 'Legs', 'equipment' => 'Machine'],
            ['name' => 'Romanian Deadlift', 'muscle_group' => 'Legs', 'equipment' => 'Barbell'],
            ['name' => 'Leg Extensions', 'muscle_group' => 'Legs', 'equipment' => 'Machine'],
            ['name' => 'Leg Curls', 'muscle_group' => 'Legs', 'equipment' => 'Machine'],
            ['name' => 'Calf Raises', 'muscle_group' => 'Legs', 'equipment' => 'Machine'],
            ['name' => 'Walking Lunges', 'muscle_group' => 'Legs', 'equipment' => 'Dumbbell'],
            ['name' => 'Bicep Curls', 'muscle_group' => 'Arms', 'equipment' => 'Dumbbell'],
            ['name' => 'Tricep Pushdown', 'muscle_group' => 'Arms', 'equipment' => 'Cable'],
            ['name' => 'Hammer Curls', 'muscle_group' => 'Arms', 'equipment' => 'Dumbbell'],
            ['name' => 'Skull Crushers', 'muscle_group' => 'Arms', 'equipment' => 'EZ Bar'],
            ['name' => 'Crunches', 'muscle_group' => 'Core', 'equipment' => 'Bodyweight'],
            ['name' => 'Plank', 'muscle_group' => 'Core', 'equipment' => 'Bodyweight'],
            ['name' => 'Russian Twists', 'muscle_group' => 'Core', 'equipment' => 'Bodyweight'],
            ['name' => 'Leg Raises', 'muscle_group' => 'Core', 'equipment' => 'Bodyweight'],
        ];

        foreach ($exercises as $exercise) {
            Exercise::firstOrCreate(
                ['name' => $exercise['name']],
                $exercise
            );
        }
    }
}
