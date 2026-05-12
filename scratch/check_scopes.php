<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

$user = User::where('email', 'demo2@gmail.com')->first();
Auth::login($user);

echo "Executing Location::all()...\n";
$locations = Location::all();
echo "Found " . count($locations) . " locations.\n";
