<?php
/**
 * app/Models/SalesRecord.php
 */

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\TenantScoped;

class SalesRecord extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    protected $collection = 'sales_records';

    protected $fillable = [
        'user_id',
        'animal_id',
        'type', // dead, sale, weight
        'treatment_date',
        'sale_date',
        'buyer_name',
        'buyer_contact',
        'sale_type',
        'quantity',
        'unit',
        'price_per_unit',
        'total_amount',
        'payment_method',
        'payment_date',
        'invoice_number',
        'death_cause',
        'disposal_method',
        'sale_price',
        'buyer',
        'weight_at_sale',
        'weight',
        'condition_score',
        'cost',
        'vendor',
        'notes',
        'attachments'
    ];

    protected $casts = [
        'treatment_date' => 'date',
        'payment_date'   => 'date',
        'sale_price'     => 'float',
        'weight_at_sale' => 'float',
        'weight'         => 'float',
        'cost'           => 'float',
        'attachments'    => 'array',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
