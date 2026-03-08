<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Staff;
use App\Models\Partner;
use App\Models\Tournament;

class HomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'featured_players' => Player::where('is_featured', true)->limit(6)->get(),
            'staff' => Staff::all(),
            'partners' => Partner::all(),
            'upcoming_tournaments' => Tournament::where('status', 'upcoming')
                ->orderBy('start_date')
                ->limit(3)
                ->get(),
        ]);
    }
}
