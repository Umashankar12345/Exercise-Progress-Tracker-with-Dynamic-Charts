<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register channel authorization callbacks
        Broadcast::channel('private-user.{id}', function ($user, $id) {
            // Only allow the authenticated user to listen to their own private channel
            return (int) $user->id === (int) $id;
        });
    }
}
?>
