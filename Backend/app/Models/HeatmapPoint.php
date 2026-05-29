<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeatmapPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'workout_session_id',
        'latitude',
        'longitude',
        'speed',
        'heart_rate',
        'calories',
        'steps',
        'intensity',
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
