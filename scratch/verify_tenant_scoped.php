<?php
require __DIR__ . '/../vendor/autoload.php';
$app    = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$models = [
    App\Models\HealthRecord::class,
    App\Models\BreedingRecord::class,
    App\Models\MovementRecord::class,
    App\Models\SalesRecord::class,
    App\Models\AnimalAttachment::class,
];

echo str_pad('Model', 22) . "| TenantScoped | user_id fillable\n";
echo str_repeat('-', 55) . "\n";

foreach ($models as $modelClass) {
    $instance = new $modelClass();
    $traits   = class_uses_recursive($modelClass);
    $hasTrait = isset($traits[App\Traits\TenantScoped::class]) ? '✅ YES' : '❌ NO ';
    $hasField = in_array('user_id', $instance->getFillable())  ? '✅ YES' : '❌ NO ';
    echo str_pad(class_basename($modelClass), 22) . "| $hasTrait        | $hasField\n";
}

echo "\nDone.\n";
