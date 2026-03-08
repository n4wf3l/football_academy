<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactClub extends Model
{
    protected $fillable = [
        'club_name', 'country', 'contact_name', 'contact_role',
        'email', 'status', 'notes',
    ];
}
