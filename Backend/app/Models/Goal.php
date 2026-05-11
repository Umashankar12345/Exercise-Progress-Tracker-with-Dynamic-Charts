<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exercise_id',
        'target_kg',
        'target_date',
        'achieved_at',
        // Legacy fields (kept for backwards compat)
        'target_weight',
        'goal_date',
        'is_achieved',
    ];

    protected $casts = [
        'target_kg'    => 'float',
        'target_date'  => 'date',
        'achieved_at'  => 'datetime',
        // Legacy
        'goal_date'    => 'date',
        'is_achieved'  => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    // ── Scopes ──────────────────────────────────────────

    /** Only goals not yet achieved */
    public function scopeActive($q)
    {
        return $q->whereNull('achieved_at');
    }

    /** Goals past their deadline without being achieved */
    public function scopeOverdue($q)
    {
        return $q->whereNull('achieved_at')
                  ->where('target_date', '<', now());
    }
}
