<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$animal = App\Models\Animal::withoutGlobalScopes()->first();
if ($animal) {
    echo "Animal ID: " . $animal->id . "\n";
    echo "User ID Type: " . gettype($animal->user_id) . "\n";
    echo "User ID Value: " . $animal->user_id . "\n";
    echo "Full Document: " . json_encode($animal->toArray(), JSON_PRETTY_PRINT) . "\n";
} else {
    echo "No animals found.\n";
}
