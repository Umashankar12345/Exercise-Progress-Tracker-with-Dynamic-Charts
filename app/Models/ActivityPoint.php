<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'activity_type',
        'points',
        'duration',
        'steps',
        'distance',
        'calories',
        'intensity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
