<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cattle extends Animal
{
    protected $collection = 'cattle';

    public function sire(): BelongsTo
    {
        return $this->belongsTo(Cattle::class, 'sire_id');
    }

    public function dam(): BelongsTo
    {
        return $this->belongsTo(Cattle::class, 'dam_id');
    }
}
