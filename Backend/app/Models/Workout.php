<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'title',
        'duration',
        'calories_burned',
        'reps',
        'type',
        'started_at',
        'ended_at',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workoutExercises()
    {
        return $this->hasMany(WorkoutExercise::class);
    }

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'workout_exercises')
                    ->withPivot('notes', 'order', 'id')
                    ->withTimestamps();
    }

    /**
     * Calculate total volume for the workout.
     */
    public function calculateVolume()
    {
        if (isset($this->attributes['sets']) && isset($this->attributes['reps']) && isset($this->attributes['weight'])) {
            return $this->attributes['sets'] * $this->attributes['reps'] * $this->attributes['weight'];
        }

        $volume = 0;
        foreach ($this->workoutExercises as $wExercise) {
            foreach ($wExercise->workoutSets as $set) {
                $volume += ($set->reps * $set->weight);
            }
        }

        return $volume > 0 ? $volume : (($this->reps ?? 10) * 3 * 60); // default fallback
    }

    /**
     * Accessor for volume.
     */
    public function getVolumeAttribute()
    {
        return $this->calculateVolume();
    }
}
