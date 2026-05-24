<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_json',
    ];

    protected $casts = [
        'plan_json' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
