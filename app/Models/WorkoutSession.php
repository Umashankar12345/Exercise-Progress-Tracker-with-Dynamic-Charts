<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'duration',
        'calories',
        'sets',
        'reps',
        'status',
        'logged_sets',
        'gps_path',
        'steps',
        'cadence',
        'activity_type',
        'heart_rate',
        'heart_rate_history',
        'workout_type',
        'distance',
    ];

    protected $casts = [
        'logged_sets' => 'array',
        'gps_path' => 'array',
        'heart_rate_history' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
