<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Find the animal with ear tag 1234
$animal = \App\Models\Animal::where('ear_tag', '1234')->first();
if (!$animal) $animal = \App\Models\Cattle::where('ear_tag', '1234')->first();

if ($animal) {
    echo "Animal 1234 belongs to user: " . $animal->user_id . "\n";
    $userId = $animal->user_id;

    // Get all male animals for this user
    $types = ['bull', 'ram', 'steer', 'Bull', 'Ram', 'Steer'];
    $males = \App\Models\Animal::where('user_id', $userId)->whereIn('type', $types)->get()
        ->concat(\App\Models\Cattle::where('user_id', $userId)->whereIn('type', $types)->get())
        ->concat(\App\Models\Sheep::where('user_id', $userId)->whereIn('type', $types)->get());

    echo "This user has " . $males->count() . " male animals.\n";
    echo json_encode($males->toArray(), JSON_PRETTY_PRINT);
} else {
    echo "Animal 1234 not found.\n";
}
