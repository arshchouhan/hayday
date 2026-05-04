<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DetectSessionExpiration
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Track whether user was authenticated in previous request
        // by checking if they have XSRF-TOKEN or old session markers
        $hadSessionBefore = $request->cookies->has('XSRF-TOKEN') || 
                           $request->header('X-Requested-With') === 'XMLHttpRequest';
        
        $isNowAuthenticated = auth()->check();
        
        // If they had a session but now don't, and it's not an API request to /login
        if ($hadSessionBefore && !$isNowAuthenticated && 
            !$request->is('login', 'api/auth/login') && 
            !$request->is('register', 'api/auth/register')) {
            
            // Store session expired flag
            session()->flash('session_expired', true);
        }
        
        return $next($request);
    }
}
