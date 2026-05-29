<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutRoutine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RoutineController extends Controller
{
    public function index()
    {
        $routines = WorkoutRoutine::where('user_id', Auth::id())
            ->orderBy('sequence_order', 'asc')
            ->get();
        return response()->json($routines);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'focus' => 'nullable|string',
            'sequence_order' => 'nullable|integer',
        ]);

        $routine = WorkoutRoutine::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'focus' => $validated['focus'] ?? null,
            'sequence_order' => $validated['sequence_order'] ?? 0,
        ]);

        return response()->json($routine, 201);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'routines' => 'required|array',
            'routines.*.id' => 'required|integer',
            'routines.*.sequence_order' => 'required|integer',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['routines'] as $item) {
                WorkoutRoutine::where('id', $item['id'])
                    ->where('user_id', Auth::id())
                    ->update(['sequence_order' => $item['sequence_order']]);
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Routines successfully reordered.',
        ]);
    }
}
