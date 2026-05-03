<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\TenantScoped;

class Animal extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    
    protected $fillable = [
        'user_id',
        'ear_tag',
        'animal_name',
        'species',
        'electronic_id',
        'ear_tag_color',
        'status',
        'type',
        'breed_id',
        'location_id',
        'group_id',
        'birth_date',
        'birth_weight',
        'conception',
        'sire_id',
        'dam_id',
        'weaning_date',
        'weaning_weight',
        'yearling_date',
        'yearling_weight',
        'notes',
        'ownership',
        'sex',
        'breeding_status',
        'death_date',
        'death_cause',
        'castration_date',
        'castration_method',
        'donor_cow_id',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'weaning_date' => 'date',
        'yearling_date' => 'date',
        'death_date' => 'date',
        'castration_date' => 'date',
    ];

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function sire(): BelongsTo
    {
        return $this->belongsTo(Animal::class, 'sire_id');
    }

    public function dam(): BelongsTo
    {
        return $this->belongsTo(Animal::class, 'dam_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(AnimalAttachment::class);
    }
}
