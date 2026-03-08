<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;

class PlayerController extends Controller
{
    public function index()
    {
        return response()->json(
            Player::orderBy('category')->orderBy('last_name')->get()
        );
    }

    public function show(Player $player)
    {
        return response()->json($player);
    }
}
