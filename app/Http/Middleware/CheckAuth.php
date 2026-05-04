<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            // If API request, return JSON error
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Detect if this is a session expiration
            $sessionExpired = $this->isSessionExpired($request);
            
            if ($sessionExpired) {
                // Show custom session expired page
                return response(view('errors.session-expired'), 200);
            }
            
            // Redirect to login page for web requests (first time)
            return redirect('/login');
        }

        return $next($request);
    }

    /**
     * Determine if the user's session has expired
     * rather than them being logged out or never logged in.
     */
    private function isSessionExpired(Request $request): bool
    {
        // Check for Laravel XSRF token - indicates they had a session
        if ($request->cookies->has('XSRF-TOKEN')) {
            return true;
        }
        
        // Check if there's a Laravel session cookie
        if ($request->cookies->has(config('session.cookie'))) {
            return true;
        }
        
        // Check for session ID in request header (AJAX requests)
        if ($request->header('X-CSRF-TOKEN')) {
            return true;
        }
        
        // Check if referrer is from authenticated area
        $referrer = $request->header('referer');
        if ($referrer && (strpos($referrer, '/farm') !== false || 
            strpos($referrer, '/health') !== false ||
            strpos($referrer, '/pedigree') !== false)) {
            return true;
        }
        
        return false;
    }
}
