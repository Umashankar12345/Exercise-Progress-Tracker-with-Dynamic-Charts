<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_exercise_id',
        'exercise_id',
        'reps',
        'weight',
        'order',
        'distance',
        'duration_seconds',
        'type',
    ];

    public function workoutExercise()
    {
        return $this->belongsTo(WorkoutExercise::class);
    }

    /**
     * Get the workout this set belongs to (via workoutExercise).
     * Used by getGhostPlaceholder to scope sets to the authenticated user.
     */
    public function workout()
    {
        return $this->hasOneThrough(
            Workout::class,
            WorkoutExercise::class,
            'id',             // FK on workout_exercises pointing to this set's workout_exercise_id
            'id',             // FK on workouts
            'workout_exercise_id', // local key on workout_sets
            'workout_id'      // local key on workout_exercises
        );
    }
}
