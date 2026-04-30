<?php
/**
 * app/Models/MovementRecord.php
 */

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovementRecord extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'movement_records';

    protected $fillable = [
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
        'notes',
        'attachments',
        'cost'
    ];

    protected $casts = [
        'treatment_date' => 'date',
        'attachments' => 'array',
        'cost' => 'float',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
