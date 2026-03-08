<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;

class TournamentController extends Controller
{
    public function index()
    {
        return response()->json(
            Tournament::orderBy('start_date', 'desc')->get()
        );
    }
}
