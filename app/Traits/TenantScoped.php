<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

trait TenantScoped
{
    protected static function bootTenantScoped()
    {
        \Illuminate\Support\Facades\Log::info("TenantScoped: Booting trait for model " . static::class);

        // Auto-assign user_id on create
        static::creating(function ($model) {
            if (!$model->user_id) {
                $model->user_id = Auth::id();
            }
        });

        // Global scope: always filter by the authenticated user's ID.
        // Fails CLOSED — if there is no authenticated user and no demo
        // fallback, the query returns zero rows rather than leaking data.
        static::addGlobalScope('user_id', function (Builder $builder) {
            $userId = Auth::id();
            \Illuminate\Support\Facades\Log::info("TenantScoped: Applying scope for user ID: " . ($userId ?: 'NULL'));

            if ($userId) {
                $builder->where('user_id', (string) $userId);
            } else {
                $builder->whereRaw(['_id' => ['$exists' => false]]);
            }
        });
    }
}
