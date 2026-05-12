<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Location;

$locations = Location::withoutGlobalScopes()->get();
echo "Total locations: " . count($locations) . "\n";
$owners = [];
foreach ($locations as $l) {
    $uid = $l->user_id ?? 'MISSING';
    $owners[$uid] = ($owners[$uid] ?? 0) + 1;
}

foreach ($owners as $uid => $count) {
    echo "User ID: $uid | Count: $count\n";
}
