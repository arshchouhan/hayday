<?php

namespace App\Console\Commands;

use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MonitorAnimals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:monitor-animals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor animals for health, breeding, and management issues and generate notifications.';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService)
    {
        $this->info('Starting animal monitoring...');
        
        // Fetch all users to process their animals
        $users = User::all();
        $this->info("Processing " . $users->count() . " users.");

        foreach ($users as $user) {
            $this->comment("Monitoring animals for user: {$user->email}");
            
            // Fetch all animals for this user
            // Note: Since we are running in console, we might need to manually handle the user context
            // if the global scope depends on Auth::user().
            
            // For MongoDB with our current setup, we might need to query without global scopes 
            // or temporarily set the authenticated user.
            
            $animals = Animal::withoutGlobalScopes()->where('user_id', (string)$user->id)->get();
            $cattle = Cattle::withoutGlobalScopes()->where('user_id', (string)$user->id)->get();
            $sheep = Sheep::withoutGlobalScopes()->where('user_id', (string)$user->id)->get();
            
            $combined = $animals->merge($cattle)->merge($sheep);
            
            foreach ($combined as $animal) {
                $notificationService->syncAnimalAttentionNotifications($user, $animal);
            }
        }

        $this->info('Monitoring complete.');
    }
}
