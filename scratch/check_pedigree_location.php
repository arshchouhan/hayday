<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;

function findAnimalAcrossCollections($id) {
    if (blank($id)) return null;
    return Animal::with(['breed', 'location'])->find($id) 
        ?? Cattle::with(['breed', 'location'])->find($id) 
        ?? Sheep::with(['breed', 'location'])->find($id);
}

// Find an animal that has a sire or dam
$animal = Animal::whereNotNull('sire_id')->first();
if (!$animal) {
    echo "No animal with sire found.\n";
    exit;
}

echo "Animal: " . $animal->ear_tag . " (ID: " . $animal->id . ")\n";
echo "Sire ID: " . $animal->sire_id . "\n";

$sire = findAnimalAcrossCollections($animal->sire_id);
if ($sire) {
    echo "Sire Ear Tag: " . $sire->ear_tag . "\n";
    echo "Sire Location: " . ($sire->location ? $sire->location->name : 'None') . "\n";
    echo "Sire Location ID in record: " . $sire->location_id . "\n";
} else {
    echo "Sire not found in any collection.\n";
}
