<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Worker extends Model
{
    protected $connection = 'mongodb';
    
    protected $fillable = [
        'name',
        'email',
        'animal_id',
        'group_id',
        'task',
        'cost',
        'status'
    ];
}
