<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Workout;
use App\Models\WorkoutSet;
use App\Mail\MonthlyReportMail;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class MonthlyReportController extends Controller
{
    public function getReport(Request $request)
    {
        $user = $request->user();
        
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        // 1. Total workouts
        $totalWorkouts = Workout::where('user_id', $user->id)
            ->whereBetween('started_at', [$startOfMonth, $endOfMonth])
            ->count();
            
        // 2. Total volume
        $totalVolume = WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($user, $startOfMonth, $endOfMonth) {
            $q->where('user_id', $user->id)->whereBetween('started_at', [$startOfMonth, $endOfMonth]);
        })->selectRaw('SUM(reps * weight) as total')->value('total') ?? 0;
        
        // 3. PRs Achieved
        $prsAchieved = WorkoutSet::whereHas('workoutExercise.workout', function ($q) use ($user, $startOfMonth, $endOfMonth) {
            $q->where('user_id', $user->id)->whereBetween('started_at', [$startOfMonth, $endOfMonth]);
        })
        ->join('workout_exercises', 'workout_sets.workout_exercise_id', '=', 'workout_exercises.id')
        ->groupBy('workout_exercises.exercise_id')
        ->get()
        ->count();
        
        // 4. Top Exercises
        $topExercises = Workout::where('user_id', $user->id)
            ->whereBetween('started_at', [$startOfMonth, $endOfMonth])
            ->join('workout_exercises', 'workouts.id', '=', 'workout_exercises.workout_id')
            ->join('exercises', 'workout_exercises.exercise_id', '=', 'exercises.id')
            ->selectRaw('exercises.name as name, COUNT(workout_exercises.id) as sessions')
            ->groupBy('exercises.name')
            ->orderByRaw('COUNT(workout_exercises.id) DESC')
            ->limit(3)
            ->get();
            
        // 5. Chart image (base64 passed from client)
        $chartImage = $request->input('chart');
        
        // Compile data for PDF
        $data = [
            'userName' => $user->name,
            'monthName' => Carbon::now()->format('F Y'),
            'totalWorkouts' => $totalWorkouts,
            'totalVolume' => $totalVolume,
            'prsAchieved' => $prsAchieved,
            'topExercises' => $topExercises,
            'chartImage' => $chartImage,
            'generatedAt' => Carbon::now()->format('M d, Y g:i A')
        ];
        
        // Render PDF
        $pdf = Pdf::loadView('pdf.monthly-report', $data);
        $pdfContent = $pdf->output();
        
        // Write PDF to a safe temporary file path in storage
        $pdfDirectory = storage_path('app/reports');
        if (!file_exists($pdfDirectory)) {
            mkdir($pdfDirectory, 0755, true);
        }
        $pdfPath = $pdfDirectory . '/report_' . $user->id . '_' . time() . '.pdf';
        file_put_contents($pdfPath, $pdfContent);
        
        // Dispatch to Queue using safe PDF path string
        Mail::to($user->email)->queue(new MonthlyReportMail($pdfPath, $user->name));
        
        return response($pdfContent, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="Monthly-Performance-Report.pdf"');
    }
}
