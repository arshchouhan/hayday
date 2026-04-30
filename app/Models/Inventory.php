<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventory extends Model
{
    protected $connection = 'mongodb';
    
    protected $fillable = [
        'name',
        'type',
        'subtype',
        'unit',
        'quantity',
        'supplier',
        'last_purchase_date'
    ];

    public function history(): HasMany
    {
        return $this->hasMany(InventoryHistory::class);
    }
}
