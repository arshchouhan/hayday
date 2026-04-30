<?php
/**
 * app/Models/HealthRecord.php
 */

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthRecord extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'health_records';

    protected $fillable = [
        'animal_id',
        'type',
        'treatment_date',
        'followup_date',
        'expected_return',
        'next_check_date',
        'observed_by',
        'location',
        'severity',
        'obs_type',
        'heat_intensity',
        'detection_method',
        'standing_heat',
        'vet_required',
        'check_method',
        'result',
        'days_pregnant',
        'breeding_date',
        'vet_name',
        'physical_exam',
        'semen_analysis',
        'overall_rating',
        'notes',
        'attachments',
        'cost'
    ];

    protected $casts = [
        'treatment_date' => 'date',
        'followup_date' => 'date',
        'expected_return' => 'date',
        'next_check_date' => 'date',
        'breeding_date' => 'date',
        'attachments' => 'array',
        'cost' => 'float',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
