<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'muscle_group',
        'equipment',
        'description',
        'difficulty',
        'instructions',
        'calories_per_min',
        'thumbnail',
        'video_url',
        'youtube_url',
    ];

    public function workouts()
    {
        return $this->belongsToMany(Workout::class, 'workout_exercises')
                    ->withPivot('notes', 'order', 'id')
                    ->withTimestamps();
    }
}
