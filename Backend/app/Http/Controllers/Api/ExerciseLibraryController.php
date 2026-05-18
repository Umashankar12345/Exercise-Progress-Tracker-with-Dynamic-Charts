<?php

namespace App\Http\Controllers\Api;

use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseLibraryController extends Controller
{
    public function index(Request $request)
    {
        $query = Exercise::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('muscle') && !empty($request->muscle) && strtolower($request->muscle) !== 'all') {
            $query->where('muscle_group', $request->muscle);
        }

        $exercises = $query->orderBy('name', 'asc')->get();

        return response()->json($exercises);
    }

    public function show($id)
    {
        $exercise = Exercise::findOrFail($id);
        return response()->json($exercise);
    }
}
