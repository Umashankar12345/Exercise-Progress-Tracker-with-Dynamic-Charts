<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExerciseSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'workout_session_id',
        'exercise_name',
        'reps',
        'duration',
        'intensity',
        'calories_burned',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workoutSession()
    {
        return $this->belongsTo(WorkoutSession::class);
    }
}
