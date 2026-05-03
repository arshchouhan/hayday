<?php
/**
 * app/Models/BreedingRecord.php
 */

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\TenantScoped;

class BreedingRecord extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    protected $collection = 'breeding_records';

    protected $fillable = [
        'user_id',
        'animal_id',
        'type', // breeding, calving, pregnancy_check
        'treatment_date',
        'activity_date',
        'calving_date',
        'check_date',
        'breeding_type',
        'breeding_method',
        'sire_id',
        'bull_id',
        'technician',
        'calf_ear_tag',
        'calf_sex',
        'calf_gender',
        'calf_weight',
        'calf_birth_weight',
        'calf_health',
        'dam_health',
        'assisted_by',
        'calving_ease',
        'check_method',
        'result',
        'preg_result',
        'days_pregnant',
        'next_check_date',
        'expected_calving',
        'notes',
        'attachments'
    ];

    protected $casts = [
        'treatment_date'  => 'date',
        'next_check_date' => 'date',
        'attachments'     => 'array',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
