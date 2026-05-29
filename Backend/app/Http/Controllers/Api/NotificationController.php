<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Workout;
use App\Models\HealthMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user ? $user->id : 1;

        // Dynamically evaluate and construct warnings
        $this->generateDynamicNotifications($userId);

        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        $userId = $request->user() ? $request->user()->id : 1;
        Notification::where('user_id', $userId)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    private function generateDynamicNotifications($userId)
    {
        // 1. Streak at risk: check if no workouts logged in the last 2 days
        $latestWorkout = Workout::where('user_id', $userId)->latest()->first();
        if ($latestWorkout) {
            $daysSince = now()->diffInDays($latestWorkout->created_at);
            if ($daysSince >= 2 && $daysSince <= 4) {
                $this->createNotification($userId, 'Workout streak at risk 🔥', "It's been {$daysSince} days since your last workout. Log a session today to keep your streak alive!", 'streak');
            }
        } else {
            // For new users with no workouts
            $this->createNotification($userId, 'Begin your training journey ⚡', "Welcome! Log your first workout to start tracking and analyzing progress.", 'streak');
        }

        // 2. Hydration low: check today's water intake
        $today = now()->toDateString();
        $todayMetric = HealthMetric::where('user_id', $userId)->where('date', $today)->first();
        if ($todayMetric && $todayMetric->water_intake < 1.5) {
            $this->createNotification($userId, 'Hydration critically low 💧', "You have only logged {$todayMetric->water_intake}L of water today. Drink up and log your hydration!", 'hydration');
        } elseif (!$todayMetric) {
            $this->createNotification($userId, 'Hydration check-in 💧', "You haven't logged any water intake today. Hydrate and record your logs!", 'hydration');
        }

        // 3. Sleep quality dropping: average of past 3 logs
        $pastLogs = HealthMetric::where('user_id', $userId)
            ->whereNotNull('sleep_hours')
            ->orderBy('date', 'desc')
            ->take(3)
            ->get();
        if ($pastLogs->count() >= 3 && $pastLogs->avg('sleep_hours') < 6.0) {
            $this->createNotification($userId, 'Sleep quality dropping 😴', "Your average sleep over the last 3 days is " . round($pastLogs->avg('sleep_hours'), 1) . "h. Rest is vital for muscle growth.", 'sleep');
        }
    }

    private function createNotification($userId, $title, $message, $type)
    {
        // Prevent duplicate unread notifications of the same type within 12 hours
        $existing = Notification::where('user_id', $userId)
            ->where('type', $type)
            ->where('is_read', false)
            ->where('created_at', '>=', now()->subHours(12))
            ->first();

        if (!$existing) {
            Notification::create([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'is_read' => false
            ]);
        }
    }
}
