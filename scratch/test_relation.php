<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$animal = \App\Models\Animal::whereNotNull('dam_id')->first();
if (!$animal) $animal = \App\Models\Cattle::whereNotNull('dam_id')->first();

if ($animal) {
    echo "Animal found: " . $animal->ear_tag . "\n";
    echo "dam_id stored as: " . $animal->dam_id . "\n";
    
    // Test direct eager load
    $animal->load('dam');
    if ($animal->dam) {
        echo "Relation 'dam' successfully loaded! Name: " . $animal->dam->animal_name . "\n";
    } else {
        echo "Relation 'dam' is NULL!\n";
    }
}
