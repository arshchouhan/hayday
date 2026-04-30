<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = [
        'name', 
        'type', 
        'sub_type', 
        'area', 
        'coordinates', 
        'color', 
        'status', 
        'ownership', 
        'water_source'
    ];

    protected $casts = [
        'coordinates' => 'array',
        'area' => 'float',
    ];

    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }
}
