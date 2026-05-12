<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $userId = Auth::id();

        if ($userId) {
            $builder->where('user_id', '=', (string) $userId);
        } else {
            // Fail closed: return no records if not authenticated
            $builder->where('user_id', 'NOT_AUTHENTICATED');
        }
    }
}
