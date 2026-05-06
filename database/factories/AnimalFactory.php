<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Animal>
 */
class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        $species = fake()->randomElement(['cow', 'sheep']);
        $isCow = $species === 'cow';

        return [
            'user_id' => 1,
            'ear_tag' => fake()->unique()->numerify('####'),
            'animal_name' => fake()->firstName(),
            'species' => $species,
            'ear_tag_color' => fake()->randomElement(['bg-white', 'bg-blue-600', 'bg-green-600', 'bg-red-500', 'bg-yellow-400', 'bg-orange-500']),
            'status' => 'active',
            'type' => $isCow ? fake()->randomElement(['Cow', 'Bull', 'Calf', 'Replacement Heifer']) : fake()->randomElement(['Ram', 'Ewe', 'Lamb', 'Wether']),
            'breed_id' => null,
            'location_id' => null,
            'group_id' => null,
            'birth_date' => fake()->dateTimeBetween('-2 years', '-8 months'),
            'birth_weight' => $isCow ? fake()->randomFloat(1, 35, 55) : fake()->randomFloat(1, 2, 7),
            'conception' => fake()->randomElement(['natural', 'ai', 'ivf']),
            'ownership' => fake()->randomElement(['Purchased', 'Raised']),
            'sex' => fake()->randomElement(['Male', 'Female']),
            'breeding_status' => $isCow ? fake()->randomElement(['Open', 'Exposed', 'Pregnant']) : null,
        ];
    }
}
