<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FatigueScore extends Model
{
    protected $fillable = [
        'user_id',
        'cns_fatigue',
        'muscular_fatigue',
        'cardio_fatigue',
        'aggregate_score',
        'breakdown',
    ];

    protected $casts = [
        'breakdown' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
