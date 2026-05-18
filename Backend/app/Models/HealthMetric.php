<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'height',
        'weight',
        'age',
        'gender',
        'bmi',
        'tdee',
        'body_fat',
        'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
