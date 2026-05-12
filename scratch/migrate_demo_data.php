<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Location;
use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Models\MovementRecord;

$demoUser = User::where('email', 'demo@gmail.com')->first();
$backupUser = User::firstOrCreate(['email' => 'demo_backup@gmail.com'], [
    'name' => 'Backup',
    'password' => bcrypt('password'),
    'ranch_name' => 'Backup'
]);

if ($demoUser) {
    echo "Moving data from demo (" . $demoUser->id . ") to backup (" . $backupUser->id . ")...\n";
    
    $count = Location::withoutGlobalScopes()->where('user_id', $demoUser->id)->update(['user_id' => $backupUser->id]);
    echo "Moved $count locations.\n";
    
    $count = Animal::withoutGlobalScopes()->where('user_id', $demoUser->id)->update(['user_id' => $backupUser->id]);
    echo "Moved $count animals.\n";
    
    $count = Cattle::withoutGlobalScopes()->where('user_id', $demoUser->id)->update(['user_id' => $backupUser->id]);
    echo "Moved $count cattle.\n";
    
    $count = Sheep::withoutGlobalScopes()->where('user_id', $demoUser->id)->update(['user_id' => $backupUser->id]);
    echo "Moved $count sheep.\n";
    
    $count = MovementRecord::withoutGlobalScopes()->where('user_id', $demoUser->id)->update(['user_id' => $backupUser->id]);
    echo "Moved $count movement records.\n";
} else {
    echo "Demo user not found.\n";
}
