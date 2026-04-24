<?php

namespace Database\Seeders;

use App\Models\Breed;
use Illuminate\Database\Seeder;

class BreedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Breed::truncate();

        $cowBreeds = ['Gir', 'Sahiwal', 'Tharparkar', 'Kankrej', 'Other'];
        foreach ($cowBreeds as $name) {
            Breed::create(['name' => $name, 'species' => 'cow']);
        }

        $sheepBreeds = ['Nellore', 'Mandya', 'Deccani', 'Chokla', 'Mecheri', 'Other'];
        foreach ($sheepBreeds as $name) {
            Breed::create(['name' => $name, 'species' => 'sheep']);
        }
    }
}
