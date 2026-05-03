<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\TenantScoped;

class Group extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    protected $fillable = ['user_id', 'name', 'description'];

    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }
}
