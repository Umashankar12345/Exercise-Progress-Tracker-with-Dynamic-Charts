<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutRoutine extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'focus',
        'sequence_order',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
