<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FarmNotification extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'notifications';

    protected $fillable = [
        'user_id',
        'animal_id',
        'category',
        'level',
        'title',
        'message',
        'action_url',
        'metadata',
        'status',
        'read_at',
        'resolved_at',
        'dedup_key',
    ];

    protected $casts = [
        'metadata' => 'array',
        'read_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];
}
