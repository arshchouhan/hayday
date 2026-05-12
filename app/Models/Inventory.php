<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\TenantScoped;

class Inventory extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'subtype',
        'unit',
        'quantity',
        'capacity',
        'supplier',
        'last_purchase_date'
    ];

    public function history(): HasMany
    {
        return $this->hasMany(InventoryHistory::class);
    }
}
