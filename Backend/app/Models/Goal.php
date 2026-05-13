<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Goal extends Model
{
    protected $fillable = [
        'user_id', 'exercise_id', 'target_kg', 'target_date', 'achieved_at',
    ];

    protected $casts = [
        'target_kg'   => 'float',
        'target_date' => 'date',
        'achieved_at' => 'datetime',
    ];

    public function user():     BelongsTo { return $this->belongsTo(User::class); }
    public function exercise(): BelongsTo { return $this->belongsTo(Exercise::class); }

    // Scope: only goals not yet achieved
    public function scopeActive($q)
    {
        return $q->whereNull('achieved_at');
    }

    // Scope: goals overdue (past date, not achieved)
    public function scopeOverdue($q)
    {
        return $q->whereNull('achieved_at')
                  ->where('target_date', '<', now());
    }
}
