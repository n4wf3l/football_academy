<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = ['name', 'type', 'logo', 'website', 'description_fr', 'description_en'];
}
