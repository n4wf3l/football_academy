<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class TrainingSessionController extends Controller
{
    public function index()
    {
        return TrainingSession::orderBy('day_of_week')
            ->orderBy('sort_order')
            ->orderBy('start_time')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time' => 'required|string|max:5',
            'end_time' => 'required|string|max:5',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'coach' => 'nullable|string|max:255',
            'color' => 'sometimes|string|max:20',
            'sort_order' => 'sometimes|integer',
        ]);

        $session = TrainingSession::create($validated);
        return response()->json($session, 201);
    }

    public function update(Request $request, TrainingSession $trainingSession)
    {
        $validated = $request->validate([
            'day_of_week' => 'sometimes|integer|min:0|max:6',
            'start_time' => 'sometimes|string|max:5',
            'end_time' => 'sometimes|string|max:5',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'coach' => 'nullable|string|max:255',
            'color' => 'sometimes|string|max:20',
            'sort_order' => 'sometimes|integer',
        ]);

        $trainingSession->update($validated);
        return response()->json($trainingSession);
    }

    public function destroy(TrainingSession $trainingSession)
    {
        $trainingSession->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'sessions' => 'required|array',
            'sessions.*.id' => 'required|exists:training_sessions,id',
            'sessions.*.day_of_week' => 'required|integer|min:0|max:6',
            'sessions.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->sessions as $item) {
            TrainingSession::where('id', $item['id'])->update([
                'day_of_week' => $item['day_of_week'],
                'sort_order' => $item['sort_order'],
            ]);
        }

        return response()->json(['status' => 'ok']);
    }
}
