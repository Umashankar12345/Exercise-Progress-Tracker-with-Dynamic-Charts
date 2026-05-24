<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WearableData extends Model
{
    use HasFactory;

    protected $table = 'wearable_data';

    protected $fillable = [
        'user_id',
        'steps',
        'heart_rate',
        'calories',
        'sleep_hours'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
