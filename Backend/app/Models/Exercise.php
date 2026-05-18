<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'muscle_group',
        'equipment',
        'description',
        'category',
        'difficulty',
        'youtube_url',
        'instructions',
    ];

    public function workouts()
    {
        return $this->belongsToMany(Workout::class, 'workout_exercises')
                    ->withPivot('notes', 'order', 'id')
                    ->withTimestamps();
    }
}
