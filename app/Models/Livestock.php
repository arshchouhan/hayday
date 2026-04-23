<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;



class Livestock extends Model
{
    //
     protected $connection = 'mongodb';
    protected $collection = 'livestocks';
    protected $fillable = ['name', 'type', 'tag_id', 'owner', 'health_status'];
}
