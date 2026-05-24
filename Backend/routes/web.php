<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\GithubController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::get('auth/github', [GithubController::class, 'redirectToGithub'])->name('auth.github');
Route::get('auth/github/callback', [GithubController::class, 'handleGithubCallback']);
