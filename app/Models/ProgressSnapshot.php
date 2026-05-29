<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'total_volume',
        'workouts_count',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
