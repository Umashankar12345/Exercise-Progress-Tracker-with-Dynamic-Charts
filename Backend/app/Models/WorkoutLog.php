<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exercise_name',
        'reps',
        'steps',
        'calories',
        'distance',
        'duration',
        'avg_heart_rate',
        'intensity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
