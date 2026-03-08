<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        return Player::orderBy('category')->orderBy('last_name')->get();
    }

    public function show(Player $player)
    {
        return $player;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'position' => 'required|string|max:100',
            'preferred_foot' => 'sometimes|string|in:right,left,both',
            'height' => 'nullable|integer',
            'weight' => 'nullable|integer',
            'nationality' => 'nullable|string|max:100',
            'category' => 'required|string|max:50',
            'goals' => 'sometimes|integer|min:0',
            'assists' => 'sometimes|integer|min:0',
            'matches_played' => 'sometimes|integer|min:0',
            'bio_fr' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'photo' => 'nullable|string|max:500',
            'highlight_video' => 'nullable|string|max:500',
            'is_featured' => 'sometimes|boolean',
        ]);

        $player = Player::create($validated);
        return response()->json($player, 201);
    }

    public function update(Request $request, Player $player)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'date_of_birth' => 'sometimes|date',
            'position' => 'sometimes|string|max:100',
            'preferred_foot' => 'sometimes|string|in:right,left,both',
            'height' => 'nullable|integer',
            'weight' => 'nullable|integer',
            'nationality' => 'nullable|string|max:100',
            'category' => 'sometimes|string|max:50',
            'goals' => 'sometimes|integer|min:0',
            'assists' => 'sometimes|integer|min:0',
            'matches_played' => 'sometimes|integer|min:0',
            'bio_fr' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'photo' => 'nullable|string|max:500',
            'highlight_video' => 'nullable|string|max:500',
            'is_featured' => 'sometimes|boolean',
        ]);

        $player->update($validated);
        return response()->json($player);
    }

    public function destroy(Player $player)
    {
        $player->delete();
        return response()->json(null, 204);
    }
}
