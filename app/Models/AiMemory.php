<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiMemory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'memory_type',
        'content',
        'importance',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
