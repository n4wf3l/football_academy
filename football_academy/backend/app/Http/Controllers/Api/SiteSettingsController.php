<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{
    public function index()
    {
        return response()->json(SiteSetting::allGrouped());
    }

    public function update(Request $request)
    {
        $request->validate([
            'academy_name' => 'sometimes|string|max:255',
            'logo_url' => 'sometimes|nullable|string|max:500',
            'primary_color' => 'sometimes|string|max:7',
            'primary_light_color' => 'sometimes|string|max:7',
            'primary_dark_color' => 'sometimes|string|max:7',
            'accent_color' => 'sometimes|string|max:7',
            'dark_color' => 'sometimes|string|max:7',
            'hero_image_url' => 'sometimes|nullable|string|max:500',
            'hero_title' => 'sometimes|string|max:255',
            'hero_subtitle' => 'sometimes|string|max:500',
            'hero_badge' => 'sometimes|string|max:255',
            'hero_video_url' => 'sometimes|nullable|string|max:500',
            'contact_email' => 'sometimes|nullable|string|max:255',
            'contact_phone' => 'sometimes|nullable|string|max:50',
            'contact_address' => 'sometimes|nullable|string|max:500',
            'social_facebook' => 'sometimes|nullable|string|max:500',
            'social_instagram' => 'sometimes|nullable|string|max:500',
            'social_youtube' => 'sometimes|nullable|string|max:500',
            'social_linkedin' => 'sometimes|nullable|string|max:500',
            'social_tiktok' => 'sometimes|nullable|string|max:500',
            'social_snapchat' => 'sometimes|nullable|string|max:500',
            'social_x' => 'sometimes|nullable|string|max:500',
        ]);

        $settingsKeys = [
            'academy_name', 'logo_url',
            'primary_color', 'primary_light_color', 'primary_dark_color',
            'accent_color', 'dark_color',
            'hero_image_url', 'hero_title', 'hero_subtitle', 'hero_badge', 'hero_video_url',
            'contact_email', 'contact_phone', 'contact_address',
            'social_facebook', 'social_instagram', 'social_youtube',
            'social_linkedin', 'social_tiktok', 'social_snapchat', 'social_x',
        ];

        foreach ($settingsKeys as $key) {
            if ($request->has($key)) {
                SiteSetting::set($key, $request->input($key));
            }
        }

        return response()->json(SiteSetting::allGrouped());
    }
}
