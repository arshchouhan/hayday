<?php

namespace Database\Factories;

use App\Models\HealthRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HealthRecord>
 */
class HealthRecordFactory extends Factory
{
    protected $model = HealthRecord::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'animal_id' => null,
            'type' => fake()->randomElement(['vaccination', 'treatment', 'observation', 'pregnancy_check']),
            'treatment_date' => now(),
            'followup_date' => null,
            'expected_return' => null,
            'next_check_date' => null,
            'observed_by' => fake()->name(),
            'location' => fake()->city(),
            'severity' => fake()->randomElement(['Low', 'Medium', 'High']),
            'obs_type' => fake()->randomElement(['Heat', 'Lameness', 'Fever', 'Routine Check']),
            'heat_intensity' => fake()->randomElement(['Low', 'Moderate', 'High']),
            'detection_method' => fake()->randomElement(['Visual', 'Sensor', 'Manual']),
            'standing_heat' => fake()->randomElement(['Yes', 'No']),
            'vet_required' => fake()->randomElement(['Yes', 'No']),
            'check_method' => fake()->randomElement(['Ultrasound', 'Palpation', 'Blood Test']),
            'result' => fake()->randomElement(['Clear', 'Monitor', 'Positive', 'Negative']),
            'days_pregnant' => fake()->numberBetween(0, 300),
            'breeding_date' => now()->subDays(fake()->numberBetween(10, 90)),
            'vet_name' => fake()->name(),
            'physical_exam' => fake()->sentence(6),
            'semen_analysis' => fake()->sentence(6),
            'overall_rating' => fake()->randomElement(['Good', 'Fair', 'Excellent']),
            'notes' => fake()->sentence(12),
            'attachments' => [],
            'cost' => fake()->randomFloat(2, 10, 120),
        ];
    }
}
