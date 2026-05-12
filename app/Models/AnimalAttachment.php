<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\TenantScoped;

class AnimalAttachment extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    protected $fillable = ['user_id', 'animal_id', 'file_path', 'file_name', 'file_type'];

    // Ensure animal_id is always handled as a string for consistency in the app
    // but the relation might need it as ObjectId for the DB match.

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}
