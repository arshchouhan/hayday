<?php

use App\Models\User;
use App\Models\InventoryHistory;

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$demoUser = User::where('email', 'demo@gmail.com')->first();

if ($demoUser) {
    $count = InventoryHistory::whereNull('user_id')->orWhere('user_id', '')->count();
    if ($count > 0) {
        InventoryHistory::whereNull('user_id')->orWhere('user_id', '')->update(['user_id' => $demoUser->id]);
        echo "Updated $count InventoryHistory entries.\n";
    } else {
        echo "No InventoryHistory entries to update.\n";
    }
}
