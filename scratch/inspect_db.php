<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$cattle = \App\Models\Cattle::all(['ear_tag', 'type'])->toArray();
$sheep = \App\Models\Sheep::all(['ear_tag', 'type'])->toArray();
$animals = \App\Models\Animal::all(['ear_tag', 'type'])->toArray();
echo json_encode(['cattle' => $cattle, 'sheep' => $sheep, 'animals' => $animals], JSON_PRETTY_PRINT);
