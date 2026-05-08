<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\AIService;
use App\Http\Controllers\Controller;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function insights(Request $request)
    {
        $userId = $request->user()->id;
        
        // Fetch from Redis Cache
        $insights = \Illuminate\Support\Facades\Cache::store('redis')->get('ai_insights_user_' . $userId);
        
        if (!$insights) {
            $insights = [
                'tip' => 'No recent AI insights found. Log a workout to generate new insights!',
                'warning' => 'Waiting for workout data.',
                'recommendation' => 'Keep pushing forward.'
            ];
        }
        
        return response()->json(['insights' => $insights]);
    }
}
