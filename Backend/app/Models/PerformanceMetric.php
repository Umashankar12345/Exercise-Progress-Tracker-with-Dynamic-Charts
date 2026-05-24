<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'completion_rate',
        'stamina_score',
        'consistency_score',
        'fatigue_score',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
