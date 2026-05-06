<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
$userId = $demoUser ? $demoUser->id : null;

$types = ['bull', 'ram', 'steer', 'Bull', 'Ram', 'Steer'];

$results = \App\Models\Animal::where('user_id', $userId)->whereIn('type', $types)->get()
    ->merge(\App\Models\Cattle::where('user_id', $userId)->whereIn('type', $types)->get())
    ->merge(\App\Models\Sheep::where('user_id', $userId)->whereIn('type', $types)->get());

echo "Male Search Results:\n";
echo json_encode($results->toArray(), JSON_PRETTY_PRINT);
