<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryHistory extends Model
{
    protected $connection = 'mongodb';
    
    protected $fillable = [
        'inventory_id',
        'quantity_added',
        'cost',
        'supplier',
        'purchase_date',
        'purchased_by',
        'notes'
    ];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }
}
