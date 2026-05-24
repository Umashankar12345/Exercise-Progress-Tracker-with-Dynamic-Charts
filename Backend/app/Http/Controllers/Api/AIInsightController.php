<?php

namespace App\Http\Controllers\Api;

use App\Models\AIInsight;
use App\Models\Workout;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AIInsightController extends Controller
{
    public function __construct(protected AIService $aiService) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $insights = AIInsight::where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json($insights);
    }

    public function unreadCount(Request $request)
    {
        $userId = $request->user()->id;

        $unreadCount = AIInsight::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'unread_count' => $unreadCount
        ]);
    }

    public function markRead(Request $request, $id)
    {
        $userId = $request->user()->id;

        $insight = AIInsight::where('user_id', $userId)
            ->findOrFail($id);

        $insight->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'insight' => $insight
        ]);
    }

    public function markAllRead(Request $request)
    {
        $userId = $request->user()->id;

        AIInsight::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Synchronously generate fresh AI insights for the user.
     * Calls AIService, saves new insights to DB, returns them.
     */
    public function generate(Request $request): JsonResponse
    {
        $user   = $request->user();
        $userId = $user->id;

        // Fetch recent workouts as context
        $recentWorkouts = Workout::where('user_id', $userId)
            ->latest()
            ->limit(10)
            ->get(['exercise_name', 'sets', 'reps', 'weight', 'calories', 'created_at'])
            ->toArray();

        // Call AI service
        $result = $this->aiService->analyzeProgress($recentWorkouts);

        if (!$result || empty($result['insights'])) {
            return response()->json(['message' => 'No insights generated'], 422);
        }

        // Persist each insight
        $saved = [];
        foreach ($result['insights'] as $insightData) {
            $insight = AIInsight::create([
                'user_id' => $userId,
                'type'    => $insightData['type'] ?? 'general',
                'content' => $insightData['content'] ?? $insightData['title'] ?? '',
                'is_read' => false,
            ]);
            $saved[] = $insight;
        }

        return response()->json([
            'success'        => true,
            'generated'      => count($saved),
            'recommendation' => $result['recommendation'] ?? '',
            'insights'       => $saved,
        ]);
    }
}
