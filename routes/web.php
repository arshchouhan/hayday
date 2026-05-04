<?php

use App\Http\Middleware\CheckAuth;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/login', function() {
    return view('welcome');
});

Route::get('/signup', function() {
    return view('welcome');
});

Route::get('/contact', function() {
    return view('welcome');
});

// Protected routes - require authentication
Route::middleware([CheckAuth::class])->group(function () {
    Route::get('/farm/{any?}', function() {
        return view('welcome');
    })->where('any', '.*');
    
    Route::get('/lifecycle/{any?}', function() {
        return view('welcome');
    })->where('any', '.*');
    
    Route::get('/health/{any?}', function() {
        return view('welcome');
    })->where('any', '.*');
    
    Route::get('/pedigree/{any?}', function() {
        return view('welcome');
    })->where('any', '.*');
});
// Google Auth Routes
Route::get('/auth/google', [App\Http\Controllers\GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [App\Http\Controllers\GoogleAuthController::class, 'handleGoogleCallback']);

// Catch all other routes for SPA
Route::get('/{any}', function() {
    return view('welcome');
})->where('any', '.*');

