<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$users = User::all();
echo "Total users: " . count($users) . "\n";
foreach ($users as $u) {
    echo "ID: " . $u->id . " | Email: " . $u->email . "\n";
}
