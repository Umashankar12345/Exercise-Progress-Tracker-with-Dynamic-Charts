<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'category',
        'difficulty',
        'equipment',
        'description',
        'thumbnail',
        'video_url',
        'muscles',
        'ai_tags',
        'calories_per_min',
    ];

    /**
     * Cast JSON columns to arrays.
     */
    protected $casts = [
        'muscles' => 'array',
        'ai_tags' => 'array',
    ];
}
?>
