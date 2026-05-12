<?php

use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Models\AnimalAttachment;
use MongoDB\BSON\ObjectId;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$animal = Cattle::find('6a036736836ca970ad0307d6') ?? Animal::find('69fb1e1d2f8d7df810098975') ?? Animal::first();

if (!$animal) {
    echo "No animal found\n";
    exit;
}

echo "Animal ID: " . $animal->id . " (" . get_class($animal) . ")\n";

$attachments = $animal->attachments;
echo "Attachments count: " . count($attachments) . "\n";

foreach ($attachments as $a) {
    echo " - " . $a->file_name . " (ID: " . $a->id . ", Animal ID: " . $a->animal_id . ")\n";
}

$currentUserId = Auth::id() ?: (\App\Models\User::where('email', 'demo@gmail.com')->first()?->id);
echo "Current User ID: " . $currentUserId . " (" . gettype($currentUserId) . ")\n";

$allAttachments = AnimalAttachment::all();
echo "Total AnimalAttachment records: " . count($allAttachments) . "\n";
foreach ($allAttachments as $a) {
    $parent = Animal::find($a->animal_id) ?? Cattle::find($a->animal_id) ?? Sheep::find($a->animal_id);
    echo " - " . $a->file_name . " (Animal ID: " . (is_object($a->animal_id) ? get_class($a->animal_id) : gettype($a->animal_id)) . " " . $a->animal_id . ", User ID: " . (is_object($a->user_id) ? get_class($a->user_id) : gettype($a->user_id)) . " " . $a->user_id . ") -> " . ($parent ? "Found (" . get_class($parent) . ")" : "NOT FOUND") . "\n";
}

echo "Manual query count (string): " . AnimalAttachment::where('animal_id', (string)$animal->id)->count() . "\n";
echo "Manual query count (ObjectId): " . AnimalAttachment::where('animal_id', new ObjectId((string)$animal->id))->count() . "\n";
