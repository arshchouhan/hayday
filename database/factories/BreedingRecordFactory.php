<?php

namespace Database\Factories;

use App\Models\BreedingRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BreedingRecord>
 */
class BreedingRecordFactory extends Factory
{
    protected $model = BreedingRecord::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'animal_id' => null,
            'type' => fake()->randomElement(['breeding', 'calving', 'pregnancy_check']),
            'treatment_date' => now(),
            'activity_date' => now(),
            'calving_date' => null,
            'check_date' => null,
            'breeding_type' => fake()->randomElement(['Natural', 'AI', 'IVF']),
            'breeding_method' => fake()->randomElement(['Natural Mating', 'Artificial Insemination', 'Embryo Transfer']),
            'sire_id' => null,
            'bull_id' => null,
            'technician' => fake()->name(),
            'calf_ear_tag' => fake()->numerify('C####'),
            'calf_sex' => fake()->randomElement(['Male', 'Female']),
            'calf_gender' => fake()->randomElement(['Bull Calf', 'Heifer Calf']),
            'calf_weight' => fake()->randomFloat(1, 20, 45),
            'calf_birth_weight' => fake()->randomFloat(1, 20, 45),
            'calf_health' => fake()->randomElement(['Healthy', 'Needs Observation']),
            'dam_health' => fake()->randomElement(['Healthy', 'Needs Observation']),
            'assisted_by' => fake()->name(),
            'calving_ease' => fake()->randomElement(['Easy', 'Moderate', 'Difficult']),
            'check_method' => fake()->randomElement(['Ultrasound', 'Rectal Palpation', 'Blood Test']),
            'result' => fake()->randomElement(['Open', 'Pregnant', 'Recheck']),
            'preg_result' => fake()->randomElement(['Open', 'Pregnant', 'Recheck']),
            'days_pregnant' => fake()->numberBetween(30, 260),
            'next_check_date' => now()->addDays(fake()->numberBetween(7, 60)),
            'expected_calving' => now()->addDays(fake()->numberBetween(30, 120)),
            'stillborn' => 'No',
            'cost' => fake()->randomFloat(2, 20, 160),
            'notes' => fake()->sentence(12),
            'attachments' => [],
        ];
    }
}
