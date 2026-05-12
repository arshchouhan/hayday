<?php
/**
 * app/Models/MovementRecord.php
 */

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\TenantScoped;

class MovementRecord extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    protected $collection = 'movement_records';

    protected $fillable = [
        'user_id',
        'animal_id',
        'type', // group, location
        'treatment_date',
        'activity_date',
        'from_group',
        'to_group',
        'from_location',
        'to_location',
        'reason',
        'moved_by',
        'effective_date',
        'cost',
        'payment_date',
        'vendor',
        'notes',
        'attachments'
    ];

    protected $casts = [
        'treatment_date' => 'date',
        'payment_date'   => 'date',
        'effective_date' => 'date',
        'cost'           => 'float',
        'attachments'    => 'array',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
