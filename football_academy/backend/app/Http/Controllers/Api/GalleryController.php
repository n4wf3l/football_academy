<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(
            GalleryItem::orderBy('created_at', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title_fr' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'type' => 'required|in:photo,video',
            'category' => 'required|string|max:100',
            'file_path' => 'required|string',
            'thumbnail' => 'nullable|string',
        ]);

        $item = GalleryItem::create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, GalleryItem $galleryItem)
    {
        $data = $request->validate([
            'title_fr' => 'sometimes|required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'type' => 'sometimes|required|in:photo,video',
            'category' => 'sometimes|required|string|max:100',
            'file_path' => 'sometimes|required|string',
            'thumbnail' => 'nullable|string',
        ]);

        $galleryItem->update($data);
        return response()->json($galleryItem);
    }

    public function destroy(GalleryItem $galleryItem)
    {
        $galleryItem->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
