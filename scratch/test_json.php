<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$animal = \App\Models\Animal::first();
$sire = \App\Models\Animal::skip(1)->first();

$animal->sire = $sire;
echo "Property test: " . json_encode($animal) . "\n";

$animal->setRelation('sire', $sire);
echo "Relation test: " . json_encode($animal) . "\n";
