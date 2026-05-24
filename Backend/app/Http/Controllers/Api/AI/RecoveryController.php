<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Services\AI\RecoveryService;
use App\Models\FatigueScore;
use App\Models\RecoveryScore;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecoveryController extends Controller
{
    public function __construct(protected RecoveryService $recovery) {}

    /**
     * Parse biometrics/loads and save daily recovery indices.
     */
    public function calculateRecovery(Request $request): JsonResponse
    {
        $user = $request->user();
        $recoveryMetrics = $this->recovery->calculateDailyRecovery($user);

        return response()->json([
            'status' => 'success',
            'recovery' => $recoveryMetrics,
        ]);
    }

    /**
     * Retrieve physiological history logs.
     */
    public function getRecoveryLogs(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $fatigueLogs = FatigueScore::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        $recoveryLogs = RecoveryScore::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return response()->json([
            'status' => 'success',
            'fatigue_history' => $fatigueLogs,
            'recovery_history' => $recoveryLogs,
        ]);
    }
}
