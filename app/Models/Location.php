<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = ['name'];

    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }
}
