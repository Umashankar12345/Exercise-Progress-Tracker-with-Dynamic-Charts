<?php

namespace App\Providers;

use App\Models\Workout;
use App\Models\WorkoutSet;
use App\Observers\ProgressSnapshotObserver;
use App\Observers\WorkoutObserver;
use App\Observers\WorkoutSetObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Model Observers
        Workout::observe(ProgressSnapshotObserver::class);
        Workout::observe(WorkoutObserver::class);
        WorkoutSet::observe(WorkoutSetObserver::class);

        // AI Throttler
        RateLimiter::for('ai', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });
    }
}
