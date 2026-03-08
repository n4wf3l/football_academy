<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingSession extends Model
{
    protected $fillable = [
        'day_of_week', 'start_time', 'end_time', 'title', 'description',
        'category', 'location', 'coach', 'color', 'sort_order',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'sort_order' => 'integer',
    ];
}
