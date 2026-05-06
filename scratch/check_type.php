<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$animal = \App\Models\Animal::whereNotNull('dam_id')->first();
if (!$animal) {
    $animal = \App\Models\Cattle::whereNotNull('dam_id')->first();
}

if ($animal) {
    $raw = $animal->getRawOriginal('dam_id');
    echo 'dam_id type: ' . gettype($raw) . "\n";
    if (is_object($raw)) {
        echo 'object class: ' . get_class($raw) . "\n";
    }
    echo 'value: ' . json_encode($raw) . "\n";
} else {
    echo "No animal with dam_id found.\n";
}
