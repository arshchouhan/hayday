<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$userId = "69f6f1cc667164fb760ec6c2"; // The user from DB dump
$types = ['bull', 'ram', 'steer', 'Bull', 'Ram', 'Steer'];

$results = \App\Models\Animal::where('user_id', $userId)->whereIn('type', $types)->get()
    ->concat(\App\Models\Cattle::where('user_id', $userId)->whereIn('type', $types)->get())
    ->concat(\App\Models\Sheep::where('user_id', $userId)->whereIn('type', $types)->get());

echo json_encode($results->toArray(), JSON_PRETTY_PRINT);
