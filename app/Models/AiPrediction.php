<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiPrediction extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'prediction_data',
        'confidence_score',
        'target_date',
    ];

    protected $casts = [
        'prediction_data' => 'array',
        'confidence_score' => 'float',
        'target_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
