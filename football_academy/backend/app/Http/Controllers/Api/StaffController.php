<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function index()
    {
        return response()->json(Staff::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'bio_fr' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'photo' => 'nullable|string|max:500',
        ]);

        $staff = Staff::create($validated);
        return response()->json($staff, 201);
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'role' => 'sometimes|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'bio_fr' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'photo' => 'nullable|string|max:500',
        ]);

        $staff->update($validated);
        return response()->json($staff);
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();
        return response()->json(null, 204);
    }
}
