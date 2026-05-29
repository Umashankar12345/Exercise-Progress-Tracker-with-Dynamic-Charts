<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecoveryScore extends Model
{
    protected $fillable = [
        'user_id',
        'sleep_score',
        'hydration_score',
        'stress_score',
        'aggregate_score',
        'recommendations',
    ];

    protected $casts = [
        'recommendations' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
