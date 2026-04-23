<?php

namespace Database\Seeders;
use App\Models\Livestock;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnimalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        Livestock::insert([
            ['name' => 'Bessie', 'type' => 'Cow',  'tag_id' => 'TAG-001', 'owner' => 'Ravi Kumar',   'health_status' => 'healthy'],
            ['name' => 'Raja',   'type' => 'Bull', 'tag_id' => 'TAG-002', 'owner' => 'Suresh Singh', 'health_status' => 'healthy'],
            ['name' => 'Kamla',  'type' => 'Goat', 'tag_id' => 'TAG-003', 'owner' => 'Meena Devi',   'health_status' => 'sick'],
        ]);

    }
}
