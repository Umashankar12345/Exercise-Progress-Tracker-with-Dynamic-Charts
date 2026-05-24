<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'step_count',
        'calories_burned',
        'date',
    ];

    /**
     * Get the user that owns the daily steps record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
