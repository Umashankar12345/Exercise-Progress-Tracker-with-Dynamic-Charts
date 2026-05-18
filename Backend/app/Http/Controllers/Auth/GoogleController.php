<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleController extends Controller
{
    /**
     * Redirects user to secure Google sign-in page
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handles incoming profile data sent back by Google
     */
    public function handleGoogleCallback()
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        try {
            // Using stateless() because API doesn't use standard session state
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Check if user already exists via google_id or matching email address
            $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();

            if ($user) {
                // If account exists by email but doesn't have google_id attached yet, link them
                if (empty($user->google_id)) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            } else {
                // Register a brand new user account directly into database
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => null, // Password nullable since they use social sign-in
                ]);
            }

            // Generate an API token for the user
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect back to React frontend with token and user data
            $userData = urlencode(json_encode([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar
            ]));

            return redirect("$frontendUrl/login?token=$token&user=$userData");

        } catch (Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect("$frontendUrl/login?error=Google authentication failed");
        }
    }
}
