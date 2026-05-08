<?php

namespace Database\Factories;

use App\Models\Worker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Worker>
 */
class WorkerFactory extends Factory
{
    protected $model = Worker::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'animal_id' => null,
            'group_id' => null,
            'task' => fake()->randomElement([
                'Morning feeding',
                'Barn cleaning',
                'Health check',
                'Breeding support',
                'Pasture inspection',
            ]),
            'cost' => fake()->randomFloat(2, 80, 320),
            'status' => fake()->randomElement(['Scheduled', 'On Duty', 'Completed']),
        ];
    }
}