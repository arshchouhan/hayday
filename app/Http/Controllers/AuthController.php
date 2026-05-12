<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'ranchName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phoneNumber' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['fullName'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phoneNumber'] ?? null,
            'ranch_name' => $validated['ranchName'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        app(NotificationService::class)->logActivityAlert([
            'category' => 'activity',
            'level' => 'success',
            'title' => 'Account created',
            'message' => 'A new farm account was created successfully.',
            'action_url' => '/farm',
            'metadata' => [
                'event' => 'account_created',
                'user_id' => (string) $user->getKey(),
            ],
        ], $user);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are invalid.'],
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::user();
        app(NotificationService::class)->logActivityAlert([
            'category' => 'activity',
            'level' => 'info',
            'title' => 'Logged in',
            'message' => 'The farm account signed in successfully.',
            'action_url' => '/farm',
            'metadata' => [
                'event' => 'user_login',
                'user_id' => (string) $user?->getKey(),
            ],
        ], $user);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => Auth::user(),
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function user(Request $request)
    {
        $user = $request->user();
        \Illuminate\Support\Facades\Log::info("AuthController: Checking auth for user: " . ($user ? $user->email : 'NULL'));
        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Update the current authenticated user profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'ranch_name' => 'required|string|max:255',
            'profile_image' => 'nullable|string|max:2048',
            'profile_image_file' => 'nullable|image|max:4096',
            'profile_image_remove' => 'nullable|boolean',
        ]);

        $profileImage = $validated['profile_image'] ?? $user->profile_image;

        if ($request->boolean('profile_image_remove')) {
            $profileImage = null;
        }

        if ($request->hasFile('profile_image_file')) {
            $storedPath = $request->file('profile_image_file')->store('profiles', 'public');
            $profileImage = Storage::disk('public')->url($storedPath);
        }

        if (array_key_exists('profile_image', $validated) && filled($validated['profile_image'])) {
            $profileImage = $validated['profile_image'];
        }

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'ranch_name' => $validated['ranch_name'],
            'profile_image' => $profileImage,
        ]);

        app(NotificationService::class)->logActivityUpdated($user, 'profile', $user->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/profile',
            'metadata' => [
                'event' => 'profile_updated',
                'user_id' => (string) $user->getKey(),
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            app(NotificationService::class)->logActivityAlert([
                'category' => 'activity',
                'level' => 'info',
                'title' => 'Logged out',
                'message' => 'The farm account signed out.',
                'action_url' => '/login',
                'metadata' => [
                    'event' => 'user_logout',
                    'user_id' => (string) $user->getKey(),
                ],
            ], $user);
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
