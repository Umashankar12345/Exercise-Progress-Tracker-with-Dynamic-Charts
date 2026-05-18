<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class GithubController extends Controller
{
    /**
     * Redirects user to secure GitHub sign-in page
     */
    public function redirectToGithub()
    {
        return Socialite::driver('github')->stateless()->redirect();
    }

    /**
     * Handles incoming profile data sent back by GitHub
     */
    public function handleGithubCallback()
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        try {
            // Using stateless() because API doesn't use standard session state
            $githubUser = Socialite::driver('github')->stateless()->user();
            
            // Check if user already exists via github_id or matching email address
            $user = User::where('github_id', $githubUser->id)
                        ->orWhere('email', $githubUser->email)
                        ->first();

            if ($user) {
                // If account exists by email but doesn't have github_id attached yet, link them
                if (empty($user->github_id)) {
                    $user->update(['github_id' => $githubUser->id]);
                }
            } else {
                // Register a brand new user account directly into database
                $user = User::create([
                    'name' => $githubUser->name ?? $githubUser->nickname ?? 'GitHub User',
                    'email' => $githubUser->email, // Note: github emails can be private/null
                    'github_id' => $githubUser->id,
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
            Log::error('GitHub Auth Error: ' . $e->getMessage());
            return redirect("$frontendUrl/login?error=GitHub authentication failed");
        }
    }
}
