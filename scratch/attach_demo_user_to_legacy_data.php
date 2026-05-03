<?php

use App\Models\User;
use App\Models\Animal;
use App\Models\Location;
use App\Models\Group;
use App\Models\Worker;
use App\Models\Inventory;
use App\Models\Breed;

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$demoUser = User::where('email', 'demo@gmail.com')->first();

if (!$demoUser) {
    echo "Demo user not found. Please run migrations/seeders first.\n";
    exit(1);
}

$models = [
    Animal::class,
    Location::class,
    Group::class,
    Worker::class,
    Inventory::class,
    Breed::class,
];

foreach ($models as $modelClass) {
    $count = $modelClass::whereNull('user_id')->orWhere('user_id', '')->count();
    echo "Updating $modelClass: Found $count entries without user_id.\n";
    
    if ($count > 0) {
        $updated = $modelClass::whereNull('user_id')->orWhere('user_id', '')->update(['user_id' => $demoUser->id]);
        echo "Successfully updated $updated entries in " . (new $modelClass)->getTable() . ".\n";
    }
}

echo "All legacy data has been attached to the demo user.\n";
