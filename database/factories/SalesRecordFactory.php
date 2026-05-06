<?php

namespace Database\Factories;

use App\Models\SalesRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SalesRecord>
 */
class SalesRecordFactory extends Factory
{
    protected $model = SalesRecord::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'animal_id' => null,
            'type' => fake()->randomElement(['weight', 'sale', 'dead']),
            'treatment_date' => now(),
            'sale_date' => now(),
            'buyer_name' => fake()->company(),
            'buyer_contact' => fake()->phoneNumber(),
            'sale_type' => fake()->randomElement(['Live', 'Carcass', 'Culled']),
            'quantity' => 1,
            'unit' => 'head',
            'price_per_unit' => fake()->randomFloat(2, 100, 800),
            'total_amount' => fake()->randomFloat(2, 100, 800),
            'payment_method' => fake()->randomElement(['Cash', 'Bank Transfer', 'Cheque']),
            'payment_date' => now(),
            'invoice_number' => fake()->unique()->numerify('INV-#####'),
            'death_cause' => fake()->randomElement(['Illness', 'Injury', 'Old Age', 'Weather']),
            'disposal_method' => fake()->randomElement(['Burial', 'Rendering', 'Pickup']),
            'sale_price' => fake()->randomFloat(2, 80, 600),
            'buyer' => fake()->company(),
            'weight_at_sale' => fake()->randomFloat(1, 200, 600),
            'weight' => fake()->randomFloat(1, 200, 600),
            'condition_score' => fake()->numberBetween(1, 5),
            'notes' => fake()->sentence(12),
            'attachments' => [],
        ];
    }
}
