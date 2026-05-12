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
                $model->user_id = Auth::id();
            }
        });

        static::addGlobalScope(new \App\Scopes\TenantScope());
    }
}
