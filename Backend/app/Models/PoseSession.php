<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PoseSession extends Model
{
    protected $fillable = [
        'user_id',
        'exercise_id',
        'exercise_name',
        'total_reps',
        'good_reps',
        'bad_reps',
        'avg_angle_deviation',
        'feedback_summary',
    ];

    protected $casts = [
        'feedback_summary' => 'array',
        'avg_angle_deviation' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
