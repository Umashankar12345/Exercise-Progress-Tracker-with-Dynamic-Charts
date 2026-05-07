<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'target_weight',
        'goal_date',
        'is_achieved',
    ];

    protected $casts = [
        'goal_date' => 'date',
        'is_achieved' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
