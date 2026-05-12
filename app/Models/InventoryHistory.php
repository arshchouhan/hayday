<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\TenantScoped;

class InventoryHistory extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    
    protected $fillable = [
        'user_id',
        'inventory_id',
        'quantity_added',
        'cost',
        'supplier',
        'purchase_date',
        'purchased_by',
        'notes',
        'cost_per_animal'
    ];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }
}
