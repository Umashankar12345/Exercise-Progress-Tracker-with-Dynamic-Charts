<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportController extends Controller
{
    public function exportWorkout(Request $request, Workout $workout)
    {
        // Ensure user owns the workout
        if ($workout->user_id !== $request->user()->id) {
            abort(403);
        }

        $workout->load('workoutExercises.workoutSets', 'workoutExercises.exercise');

        $pdf = Pdf::loadView('exports.workout', compact('workout'));
        
        return $pdf->download('workout-'.$workout->id.'.pdf');
    }
}
