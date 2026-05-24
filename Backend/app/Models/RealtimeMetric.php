<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RealtimeMetric extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'metric_type',
        'metric_value',
        'recorded_at',
    ];

    protected $casts = [
        'metric_value' => 'array',
        'recorded_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
