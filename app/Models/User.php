<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar_url',
        'fitness_goal',
        'experience_level',
        'weight',
        'height',
        'injuries',
        'google_id',
        'github_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'injuries' => 'array',
            'weight' => 'float',
            'height' => 'float',
        ];
    }

    public function workouts()
    {
        return $this->hasMany(Workout::class);
    }

    public function progressSnapshots()
    {
        return $this->hasMany(ProgressSnapshot::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function dailySteps()
    {
        return $this->hasMany(DailyStep::class);
    }

    public function bodyMetrics()
    {
        return $this->hasMany(BodyMetric::class);
    }

    public function workoutPlans()
    {
        return $this->hasMany(WorkoutPlan::class);
    }

    public function healthMetrics()
    {
        return $this->hasMany(HealthMetric::class);
    }

    public function aiMemories()
    {
        return $this->hasMany(AiMemory::class);
    }

    public function performanceMetrics()
    {
        return $this->hasMany(PerformanceMetric::class);
    }
}
