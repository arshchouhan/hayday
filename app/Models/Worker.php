<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use App\Traits\TenantScoped;

class Worker extends Model
{
    use TenantScoped;

    protected $connection = 'mongodb';
    
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'animal_id',
        'group_id',
        'task',
        'cost',
        'status'
    ];
}
