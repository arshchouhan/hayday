<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

$testUserEmail = 'demo2@gmail.com'; // A user with 0 locations
$user = User::where('email', $testUserEmail)->first();

if (!$user) {
    echo "User $testUserEmail not found!\n";
    exit;
}

Auth::login($user);
echo "Logged in as: " . Auth::user()->email . " (ID: " . Auth::id() . ")\n";

$locations = Location::all();
echo "Locations found for this user: " . count($locations) . "\n";
foreach ($locations as $l) {
    echo " - " . $l->name . " (User ID: " . $l->user_id . ")\n";
}

$allLocationsCount = Location::withoutGlobalScopes()->count();
echo "Total locations in DB (unfiltered): $allLocationsCount\n";
