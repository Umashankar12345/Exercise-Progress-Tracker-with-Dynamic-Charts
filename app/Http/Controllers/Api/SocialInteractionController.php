<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityConnection;
use App\Models\WorkoutImport;
use App\Models\ChallengeParticipant;
use App\Models\LiveSession;
use App\Models\Notification;
use App\Models\WorkoutPlan;
use App\Models\User;
use App\Models\Challenge;
use App\Events\SocialEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialInteractionController extends Controller
{
    public function connectUser(Request $request)
    {
        $validated = $request->validate([
            'connected_user_id' => 'required',
        ]);
        
        $userId = Auth::id();
        $targetId = $validated['connected_user_id'];

        if ($userId == $targetId) {
            return response()->json(['message' => 'You cannot connect with yourself.'], 400);
        }

        $connection = CommunityConnection::where('user_id', $userId)
            ->where('connected_user_id', $targetId)
            ->first();

        if ($connection) {
            $connection->delete();
            
            // Broadcast disconnect event
            event(new SocialEvent("social", "ConnectionStatusChanged", [
                'user_id' => $userId,
                'connected_user_id' => $targetId,
                'status' => 'disconnected'
            ]));
            
            return response()->json(['status' => 'disconnected', 'message' => 'Disconnected successfully.']);
        }

        $connection = CommunityConnection::create([
            'user_id' => $userId,
            'connected_user_id' => $targetId,
            'status' => 'connected'
        ]);

        // Create Notification for target user
        Notification::create([
            'user_id' => $targetId,
            'title' => 'New Connection',
            'message' => Auth::user()->name . ' connected with you!',
            'type' => 'connection',
            'is_read' => false
        ]);

        // Broadcast connect event
        event(new SocialEvent("social", "ConnectionStatusChanged", [
            'user_id' => $userId,
            'connected_user_id' => $targetId,
            'status' => 'connected',
            'user' => Auth::user()
        ]));

        return response()->json(['status' => 'connected', 'message' => 'Connected successfully.']);
    }

    public function getConnections(Request $request)
    {
        $connections = CommunityConnection::where('user_id', Auth::id())->pluck('connected_user_id');
        return response()->json($connections);
    }

    public function importWorkout(Request $request)
    {
        $validated = $request->validate([
            'split_name' => 'required|string',
        ]);
        
        $userId = Auth::id();

        // Create a workout plan import record
        $import = WorkoutImport::create([
            'user_id' => $userId,
            'split_name' => $validated['split_name'],
        ]);

        // Create or update user's WorkoutPlan to reflect this imported split
        $latestPlan = WorkoutPlan::where('user_id', $userId)->latest()->first();
        $newDay = [
            'day' => 'Imported Day',
            'title' => $validated['split_name'],
            'focus' => 'Targeted Hypertrophy Split',
            'exercises' => 6,
            'volume' => 'High'
        ];

        if ($latestPlan) {
            $planJson = $latestPlan->plan_json;
            if (!isset($planJson['days'])) {
                $planJson['days'] = [];
            }
            array_unshift($planJson['days'], $newDay);
            $latestPlan->update(['plan_json' => $planJson]);
            $planData = $planJson;
        } else {
            $planData = [
                'days' => [$newDay],
                'ai_adjustments' => [
                    ['type' => 'Imported Program', 'text' => 'Successfully integrated split: ' . $validated['split_name']]
                ],
                'statistics' => [
                    'frequency' => '1x / Week',
                    'avg_time' => '60 Minutes',
                    'next_deload' => 'N/A'
                ]
            ];
            WorkoutPlan::create([
                'user_id' => $userId,
                'plan_json' => $planData
            ]);
        }

        // Create Notification
        Notification::create([
            'user_id' => $userId,
            'title' => 'Program Imported',
            'message' => 'Successfully imported split: ' . $validated['split_name'],
            'type' => 'workout_import',
            'is_read' => false
        ]);

        // Broadcast import event
        event(new SocialEvent("social", "WorkoutImported", [
            'user_id' => $userId,
            'split_name' => $validated['split_name'],
            'plan_json' => $planData
        ]));

        return response()->json([
            'message' => 'Workout program imported successfully!',
            'plan' => $planData
        ]);
    }

    public function joinChallenge(Request $request, $id)
    {
        $userId = Auth::id();
        
        $participant = ChallengeParticipant::where('user_id', $userId)
            ->where('challenge_id', $id)
            ->first();

        if ($participant) {
            $participant->delete();
            
            // Broadcast event
            event(new SocialEvent("social", "ChallengeLeft", [
                'user_id' => $userId,
                'challenge_id' => $id
            ]));
            
            return response()->json(['status' => 'left', 'message' => 'Left challenge successfully.']);
        }

        // Auto create Challenge record if missing (for demo safety)
        $challenge = Challenge::find($id);
        if (!$challenge) {
            $challenge = Challenge::create([
                'id' => $id,
                'title' => $id == 1 ? 'Global 100K Steps' : '30-Day HIIT Burn',
                'description' => 'A demo fitness challenge.',
                'type' => 'steps',
                'goal_amount' => 100000,
                'xp_reward' => 500
            ]);
        }

        $participant = ChallengeParticipant::create([
            'user_id' => $userId,
            'challenge_id' => $id,
            'progress' => 0,
            'status' => 'joined'
        ]);

        // Create Notification
        Notification::create([
            'user_id' => $userId,
            'title' => 'Challenge Joined',
            'message' => 'You have joined the ' . $challenge->title . ' challenge!',
            'type' => 'challenge',
            'is_read' => false
        ]);

        // Broadcast join event
        event(new SocialEvent("social", "ChallengeJoined", [
            'user_id' => $userId,
            'challenge_id' => $id,
            'challenge' => $challenge
        ]));

        return response()->json(['status' => 'joined', 'message' => 'Joined challenge successfully.']);
    }

    public function getActiveChallenges(Request $request)
    {
        $challenges = ChallengeParticipant::where('user_id', Auth::id())->pluck('challenge_id');
        return response()->json($challenges);
    }

    public function getLeaderboard(Request $request)
    {
        $rankings = [
            ['rank' => 1, 'name' => 'David K.', 'score' => '98.5', 'trend' => 'up', 'color' => '#FACC15' ],
            ['rank' => 2, 'name' => 'Sarah M.', 'score' => '97.2', 'trend' => 'same', 'color' => '#94A3B8' ],
            ['rank' => 3, 'name' => 'Alex T.', 'score' => '95.8', 'trend' => 'down', 'color' => '#B45309' ],
            ['rank' => 4, 'name' => 'Emma W.', 'score' => '91.4', 'trend' => 'same', 'color' => 'transparent' ],
        ];

        $user = Auth::user();
        $userRank = ['rank' => 5, 'name' => $user->name ?? 'You', 'score' => '92.1', 'trend' => 'up', 'color' => '#3B82F6', 'isUser' => true];
        
        array_splice($rankings, 3, 0, [$userRank]);

        foreach ($rankings as $idx => &$r) {
            $r['rank'] = $idx + 1;
        }

        return response()->json($rankings);
    }

    public function joinLiveSession(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|string',
        ]);
        
        $userId = Auth::id();
        $roomId = $validated['room_id'];

        $session = LiveSession::updateOrCreate(
            ['user_id' => $userId, 'room_id' => $roomId],
            ['status' => 'active']
        );

        $count = LiveSession::where('room_id', $roomId)->where('status', 'active')->count();

        Notification::create([
            'user_id' => $userId,
            'title' => 'Joined Live Session',
            'message' => 'You joined the Live Studio workout session!',
            'type' => 'live_session',
            'is_read' => false
        ]);

        event(new SocialEvent("live-room." . $roomId, "ParticipantJoined", [
            'user_id' => $userId,
            'room_id' => $roomId,
            'participant_count' => $count,
            'user_name' => Auth::user()->name
        ]));

        return response()->json([
            'message' => 'Joined live session successfully.',
            'room_id' => $roomId,
            'participant_count' => $count
        ]);
    }

    public function leaveLiveSession(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|string',
        ]);
        
        $userId = Auth::id();
        $roomId = $validated['room_id'];

        $session = LiveSession::where('user_id', $userId)->where('room_id', $roomId)->first();
        if ($session) {
            $session->update(['status' => 'left']);
        }

        $count = LiveSession::where('room_id', $roomId)->where('status', 'active')->count();

        event(new SocialEvent("live-room." . $roomId, "ParticipantLeft", [
            'user_id' => $userId,
            'room_id' => $roomId,
            'participant_count' => $count,
            'user_name' => Auth::user()->name
        ]));

        return response()->json([
            'message' => 'Left live session successfully.',
            'room_id' => $roomId,
            'participant_count' => $count
        ]);
    }

    public function getLiveSessionParticipants(Request $request, $roomId)
    {
        $count = LiveSession::where('room_id', $roomId)->where('status', 'active')->count();
        return response()->json(['participant_count' => $count]);
    }
}
