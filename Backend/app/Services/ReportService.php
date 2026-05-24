<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;

class ReportService
{
    /**
     * Generate the monthly fitness PDF report.
     */
    public function generate(array $data)
    {
        // Enforce Blade variables with clean defaults
        $payload = [
            'monthName' => $data['monthName'] ?? Carbon::now()->format('F Y'),
            'userName' => $data['userName'] ?? 'Athlete',
            'totalWorkouts' => $data['totalWorkouts'] ?? 0,
            'totalVolume' => $data['totalVolume'] ?? 0,
            'prsAchieved' => $data['prsAchieved'] ?? 0,
            'topExercises' => $data['topExercises'] ?? [],
            'chartImage' => $data['chartImage'] ?? null,
            'generatedAt' => $data['generatedAt'] ?? Carbon::now()->toDateTimeString(),
        ];

        $pdf = Pdf::loadView('pdf.monthly-report', $payload);

        return $pdf->download('fitness-report.pdf');
    }
}
