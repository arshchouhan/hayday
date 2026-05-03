<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

trait TenantScoped
{
    protected static function bootTenantScoped()
    {
        // Auto-assign user_id on create
        static::creating(function ($model) {
            if (!$model->user_id) {
                $userId = Auth::id();
                if (!$userId) {
                    $demoUser = User::where('email', 'demo@gmail.com')->first();
                    $userId = $demoUser ? $demoUser->id : null;
                }
                $model->user_id = $userId;
            }
        });

        // Global scope: always filter by the authenticated user's ID.
        // Fails CLOSED — if there is no authenticated user and no demo
        // fallback, the query returns zero rows rather than leaking data.
        static::addGlobalScope('user_id', function (Builder $builder) {
            $userId = Auth::id();

            if (!$userId) {
                $demoUser = User::where('email', 'demo@gmail.com')->first();
                $userId = $demoUser ? $demoUser->id : null;
            }

            if ($userId) {
                $builder->where('user_id', (string) $userId);
            } else {
                // No authenticated user and no demo account — return nothing.
                $builder->whereRaw(['_id' => ['$exists' => false]]);
            }
        });
    }
}
