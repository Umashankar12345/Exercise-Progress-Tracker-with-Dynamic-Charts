<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutImport extends Model
{
    protected $fillable = [
        'user_id',
        'workout_plan_id',
        'split_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workoutPlan()
    {
        return $this->belongsTo(WorkoutPlan::class);
    }
}
