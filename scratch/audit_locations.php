<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Location;

foreach(Location::withoutGlobalScopes()->get() as $l) {
    echo "ID: " . $l->id . " | Name: " . $l->name . " | User ID: " . ($l->user_id ?: 'NULL') . "\n";
}
