<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$id = "69edf31495ccf83ee80fc213";
echo "Searching for $id\n";

$animal = \App\Models\Animal::find($id);
echo "Animal: " . ($animal ? $animal->type : 'not found') . "\n";

$cattle = \App\Models\Cattle::find($id);
echo "Cattle: " . ($cattle ? $cattle->type : 'not found') . "\n";

$sheep = \App\Models\Sheep::find($id);
echo "Sheep: " . ($sheep ? $sheep->type : 'not found') . "\n";
