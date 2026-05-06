<?php

namespace Database\Factories;

use App\Models\MovementRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MovementRecord>
 */
class MovementRecordFactory extends Factory
{
    protected $model = MovementRecord::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'animal_id' => null,
            'type' => 'location',
            'treatment_date' => now(),
            'activity_date' => now(),
            'from_group' => null,
            'to_group' => null,
            'from_location' => null,
            'to_location' => null,
            'reason' => fake()->sentence(8),
            'moved_by' => fake()->name(),
            'effective_date' => now(),
            'notes' => fake()->sentence(12),
            'attachments' => [],
            'cost' => fake()->randomFloat(2, 5, 60),
        ];
    }
}
