<?php

use App\Models\AnimalAttachment;
use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use MongoDB\BSON\ObjectId;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach ($attachments as $a) {
    echo "Updating attachment " . $a->id . " - setting animal_id to string\n";
    $a->animal_id = (string)$a->animal_id;
    $a->save();
}

echo "Done.\n";
