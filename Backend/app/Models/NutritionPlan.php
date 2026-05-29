<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionPlan extends Model
{
    protected $fillable = [
        'user_id',
        'daily_calories',
        'protein_g',
        'carbs_g',
        'fats_g',
        'goal_type',
        'meal_structure',
    ];

    protected $casts = [
        'meal_structure' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
