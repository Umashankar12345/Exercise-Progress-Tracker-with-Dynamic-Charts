<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Workout;
use App\Observers\ProgressSnapshotObserver;

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
        Workout::observe(ProgressSnapshotObserver::class);
        \App\Models\WorkoutSet::observe(\App\Observers\WorkoutSetObserver::class);
    }
}
