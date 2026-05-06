<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$animal = \App\Models\Animal::whereNotNull('location_id')->first();
if (!$animal) $animal = \App\Models\Cattle::whereNotNull('location_id')->first();

if ($animal) {
    $raw = $animal->getRawOriginal('location_id');
    echo 'location_id type: ' . gettype($raw) . "\n";
    if (is_object($raw)) echo 'object class: ' . get_class($raw) . "\n";
}
