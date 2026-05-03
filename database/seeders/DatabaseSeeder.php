<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Breed;
use App\Models\Location;
use App\Models\Group;
use App\Models\Animal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create demo user
        $demoUser = User::updateOrCreate(
            ['email' => 'demo@gmail.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('demo'),
                'ranch_name' => "Arsh's Farm",
                'phone' => '+1-555-123-4567',
                'gmail_email' => 'demo@gmail.com',
                'gmail_password' => 'demo',
            ]
        );

        // Create breeds for cattle
        $cattleBreeds = [
            ['name' => 'American Lineback', 'species' => 'cow', 'user_id' => $demoUser->id],
            ['name' => 'Angus', 'species' => 'cow', 'user_id' => $demoUser->id],
            ['name' => 'Hereford', 'species' => 'cow', 'user_id' => $demoUser->id],
            ['name' => 'Jersey', 'species' => 'cow', 'user_id' => $demoUser->id],
            ['name' => 'Holstein', 'species' => 'cow', 'user_id' => $demoUser->id],
        ];

        $cattleBreedIds = [];
        foreach ($cattleBreeds as $breed) {
            $b = Breed::create($breed);
            $cattleBreedIds[] = $b->_id;
        }

        // Create breeds for sheep
        $sheepBreeds = [
            ['name' => 'Dorper', 'species' => 'sheep', 'user_id' => $demoUser->id],
            ['name' => 'Merino', 'species' => 'sheep', 'user_id' => $demoUser->id],
            ['name' => 'Texel', 'species' => 'sheep', 'user_id' => $demoUser->id],
            ['name' => 'Suffolks', 'species' => 'sheep', 'user_id' => $demoUser->id],
        ];

        $sheepBreedIds = [];
        foreach ($sheepBreeds as $breed) {
            $b = Breed::create($breed);
            $sheepBreedIds[] = $b->_id;
        }

        // Create locations
        $locations = [
            ['name' => "Arsh's Farm", 'description' => 'Main farm location', 'user_id' => $demoUser->id],
            ['name' => 'Grazing Pasture A', 'description' => 'North pasture for cattle', 'user_id' => $demoUser->id],
            ['name' => 'Grazing Pasture B', 'description' => 'South pasture for sheep', 'user_id' => $demoUser->id],
        ];

        $locationIds = [];
        foreach ($locations as $location) {
            $loc = Location::create($location);
            $locationIds[] = $loc->_id;
        }

        // Create groups
        $groups = [
            ['name' => 'Default Group', 'description' => 'Default animal group', 'user_id' => $demoUser->id],
            ['name' => 'Breeding Herd', 'description' => 'Cattle breeding group', 'user_id' => $demoUser->id],
            ['name' => 'Young Stock', 'description' => 'Young animals group', 'user_id' => $demoUser->id],
        ];

        $groupIds = [];
        foreach ($groups as $group) {
            $g = Group::create($group);
            $groupIds[] = $g->_id;
        }

        // Create sample cattle animals
        $cattleAnimals = [
            [
                'user_id' => $demoUser->id,
                'ear_tag' => 'newtag',
                'animal_name' => 'newtag',
                'species' => 'cow',
                'type' => 'cow',
                'status' => 'active',
                'breed_id' => $cattleBreedIds[0],
                'location_id' => $locationIds[0],
                'group_id' => $groupIds[0],
                'birth_weight' => 45,
                'ownership' => 'Purchased',
            ],
            [
                'user_id' => $demoUser->id,
                'ear_tag' => 'efgh',
                'animal_name' => 'efgh',
                'species' => 'cow',
                'type' => 'cow',
                'status' => 'active',
                'breed_id' => $cattleBreedIds[1],
                'location_id' => $locationIds[1],
                'group_id' => $groupIds[1],
                'birth_weight' => 48,
                'ownership' => 'Purchased',
            ],
            [
                'user_id' => $demoUser->id,
                'ear_tag' => '11111',
                'animal_name' => '11111',
                'species' => 'cow',
                'type' => 'cow',
                'status' => 'active',
                'breed_id' => $cattleBreedIds[2],
                'location_id' => $locationIds[0],
                'group_id' => $groupIds[0],
                'birth_weight' => 42,
                'ownership' => 'Purchased',
            ],
            [
                'user_id' => $demoUser->id,
                'ear_tag' => '2222',
                'animal_name' => '2222',
                'species' => 'cow',
                'type' => 'cow',
                'status' => 'active',
                'breed_id' => $cattleBreedIds[3],
                'location_id' => $locationIds[1],
                'group_id' => $groupIds[1],
                'birth_weight' => 50,
                'ownership' => 'Purchased',
            ],
        ];

        foreach ($cattleAnimals as $animal) {
            Animal::create($animal);
        }

        // Create sample sheep animals
        $sheepAnimals = [
            [
                'user_id' => $demoUser->id,
                'ear_tag' => '5001',
                'animal_name' => 'Sheep 1',
                'species' => 'sheep',
                'type' => 'ewe',
                'status' => 'active',
                'breed_id' => $sheepBreedIds[0],
                'location_id' => $locationIds[2],
                'group_id' => $groupIds[2],
                'birth_weight' => 4.5,
                'ownership' => 'Purchased',
            ],
            [
                'user_id' => $demoUser->id,
                'ear_tag' => '5002',
                'animal_name' => 'Sheep 2',
                'species' => 'sheep',
                'type' => 'ram',
                'status' => 'active',
                'breed_id' => $sheepBreedIds[1],
                'location_id' => $locationIds[2],
                'group_id' => $groupIds[2],
                'birth_weight' => 5.2,
                'ownership' => 'Purchased',
            ],
        ];

        foreach ($sheepAnimals as $animal) {
            Animal::create($animal);
        }
    }
}
