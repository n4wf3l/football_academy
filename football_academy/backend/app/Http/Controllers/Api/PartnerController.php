<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function index()
    {
        return response()->json(Partner::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'logo' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
        ]);

        $partner = Partner::create($data);
        return response()->json($partner, 201);
    }

    public function update(Request $request, Partner $partner)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:100',
            'logo' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
        ]);

        $partner->update($data);
        return response()->json($partner);
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
