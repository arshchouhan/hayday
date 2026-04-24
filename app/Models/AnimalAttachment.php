<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnimalAttachment extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = ['animal_id', 'file_path', 'file_name', 'file_type'];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
