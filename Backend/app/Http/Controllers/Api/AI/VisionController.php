<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Services\AI\VisionService;
use App\Services\AI\BiomechanicsService;
use App\Events\LiveVisionFeedbackEvent;
use App\Models\PoseSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VisionController extends Controller
{
    public function __construct(
        protected VisionService $vision,
        protected BiomechanicsService $biomechanics
    ) {}

    /**
     * Store webcam joint angle logging data.
     */
    public function logPoseSession(Request $request): JsonResponse
    {
        $request->validate([
            'exercise_name' => 'required|string|max:100',
            'exercise_id' => 'nullable|integer|exists:exercises,id',
            'total_reps' => 'required|integer|min:0',
            'good_reps' => 'required|integer|min:0',
            'bad_reps' => 'required|integer|min:0',
            'avg_angle_deviation' => 'required|numeric',
            'triggers' => 'nullable|array',
            'reps_log' => 'nullable|array',
            'landmarks_history' => 'nullable|array',
        ]);

        $user = $request->user();
        $session = $this->vision->processPoseSession($user, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Pose tracking run successfully saved.',
            'pose_session_id' => $session->id,
        ], 201);
    }

    /**
     * Compile biomechanical coaching logs from pose estimations.
     */
    public function getPoseReport(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();
        $report = $this->vision->generatePostureReport($user, (int)$sessionId);

        return response()->json([
            'status' => 'success',
            'biomechanical_report' => $report,
        ]);
    }

    /**
     * Calculate angles dynamically and broadcast feedback over Reverb WebSocket.
     */
    public function streamPose(Request $request): JsonResponse
    {
        $request->validate([
            'a' => 'required|array|min:2',
            'b' => 'required|array|min:2',
            'c' => 'required|array|min:2',
            'reps' => 'required|integer',
        ]);

        $user = $request->user();
        
        $a = $request->input('a');
        $b = $request->input('b');
        $c = $request->input('c');
        $reps = $request->input('reps');

        // Compute coordinate angle
        $angle = $this->biomechanics->calculateAngle($a, $b, $c);

        $msg = 'Form is stable.';
        $warning = null;

        // Perform rep form rules
        if ($angle < 90) {
            $msg = 'Good squat depth! Keep pushing.';
        } elseif ($angle > 160) {
            $msg = 'Full extension. Lock hips.';
        } else {
            $msg = 'Descending... keep core tight.';
        }

        if ($angle < 60) {
            $warning = 'Deep squat warning: Check lumbar curve rounding!';
        }

        $feedback = [
            'angle' => round($angle, 2),
            'reps' => $reps,
            'msg' => $msg,
            'warning' => $warning,
        ];

        // Broadcast event live
        broadcast(new LiveVisionFeedbackEvent($user->id, $feedback));

        return response()->json([
            'status' => 'success',
            'feedback' => $feedback,
        ]);
    }
}
