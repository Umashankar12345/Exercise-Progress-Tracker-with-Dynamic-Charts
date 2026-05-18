<?php

namespace App\Http\Controllers\Api;

use App\Models\AIInsight;
use Illuminate\Http\Request;

class AIInsightController extends Controller
{
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
}
