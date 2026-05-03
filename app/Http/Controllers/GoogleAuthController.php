<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            // Disable SSL verification for local dev (fixes cURL error 60)
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
                ->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Google authentication failed: ' . $e->getMessage());
        }

        // Check if user already exists by google_id
        $user = User::where('google_id', $googleUser->id)->first();

        if (!$user) {
            // Check if user exists by email (to link account)
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // Link Google ID to existing account
                $user->update(['google_id' => $googleUser->id]);
            } else {
                // Create a new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(24)), // Random password for new users
                    'ranch_name' => $googleUser->name . "'s Ranch", // Default ranch name
                ]);
            }
        }

        // Log the user in
        Auth::login($user);
        $request->session()->regenerate();

        // Redirect to the frontend dashboard
        return redirect('/farm');
    }
}
