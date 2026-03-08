<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'date_of_birth', 'position',
        'preferred_foot', 'height', 'weight', 'nationality', 'category',
        'goals', 'assists', 'matches_played', 'bio_fr', 'bio_en',
        'photo', 'highlight_video', 'is_featured',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_featured' => 'boolean',
    ];
}
