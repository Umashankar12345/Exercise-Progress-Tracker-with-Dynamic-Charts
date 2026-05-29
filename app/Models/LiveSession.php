<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveSession extends Model
{
    protected $fillable = [
        'user_id',
        'room_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
