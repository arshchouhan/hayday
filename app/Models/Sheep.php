<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sheep extends Animal
{
    protected $collection = 'sheep';

    public function sire(): BelongsTo
    {
        return $this->belongsTo(Sheep::class, 'sire_id');
    }

    public function dam(): BelongsTo
    {
        return $this->belongsTo(Sheep::class, 'dam_id');
    }
}
