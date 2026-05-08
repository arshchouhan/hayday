<?php

namespace Database\Seeders;

use App\Models\Animal;
use App\Models\Cattle;
use App\Models\FarmNotification;
use App\Models\Worker;
use App\Models\User;
use App\Models\Breed;
use App\Models\BreedingRecord;
use App\Models\HealthRecord;
use App\Models\MovementRecord;
use App\Models\SalesRecord;
use App\Models\Sheep;
use App\Models\Location;
use App\Models\Group;
use Database\Factories\AnimalFactory;
use Database\Factories\BreedingRecordFactory;
use Database\Factories\HealthRecordFactory;
use Database\Factories\MovementRecordFactory;
use Database\Factories\WorkerFactory;
use Database\Factories\SalesRecordFactory;
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

        $breedIds = [];
        foreach ([
            ['name' => 'Angus', 'species' => 'cow'],
            ['name' => 'Hereford', 'species' => 'cow'],
            ['name' => 'Holstein', 'species' => 'cow'],
            ['name' => 'Jersey', 'species' => 'cow'],
            ['name' => 'Dorper', 'species' => 'sheep'],
            ['name' => 'Merino', 'species' => 'sheep'],
        ] as $breed) {
            $model = Breed::updateOrCreate(
                ['name' => $breed['name'], 'species' => $breed['species'], 'user_id' => $demoUser->id],
                ['user_id' => $demoUser->id]
            );

            $breedIds[$breed['name']] = $model->getKey();
        }

        $locationIds = [];
        foreach ([
            ['name' => "Arsh's Farm", 'description' => 'Main farm location'],
            ['name' => 'North Pasture', 'description' => 'Primary cattle pasture'],
            ['name' => 'South Pasture', 'description' => 'Sheep grazing area'],
            ['name' => 'Breeding Barn', 'description' => 'Reproduction and calving area'],
        ] as $location) {
            $model = Location::updateOrCreate(
                ['name' => $location['name'], 'user_id' => $demoUser->id],
                $location + ['user_id' => $demoUser->id]
            );

            $locationIds[$location['name']] = $model->getKey();
        }

        $groupIds = [];
        foreach ([
            ['name' => 'Default Group', 'description' => 'Default animal group'],
            ['name' => 'Breeding Herd', 'description' => 'Cattle breeding group'],
            ['name' => 'Young Stock', 'description' => 'Young animals group'],
        ] as $group) {
            $model = Group::updateOrCreate(
                ['name' => $group['name'], 'user_id' => $demoUser->id],
                $group + ['user_id' => $demoUser->id]
            );

            $groupIds[$group['name']] = $model->getKey();
        }

        $seedAnimal = function (string $earTag, array $overrides) use ($demoUser): Animal {
            $payload = AnimalFactory::new()->raw(array_merge([
                'user_id' => $demoUser->id,
                'ear_tag' => $earTag,
            ], $overrides));

            return Animal::updateOrCreate(
                ['user_id' => $demoUser->id, 'ear_tag' => $earTag],
                $payload
            );
        };

        $heroCow = $seedAnimal('1234', [
            'animal_name' => 'Mabel',
            'species' => 'cow',
            'type' => 'Cow',
            'status' => 'active',
            'ear_tag_color' => 'bg-emerald-500',
            'breed_id' => $breedIds['Angus'],
            'location_id' => $locationIds['Arsh\'s Farm'],
            'group_id' => $groupIds['Breeding Herd'],
            'birth_date' => now()->subMonths(11)->toDateString(),
            'birth_weight' => 38.4,
            'weaning_date' => now()->subMonths(7)->toDateString(),
            'weaning_weight' => 128.6,
            'yearling_date' => now()->subMonths(2)->toDateString(),
            'yearling_weight' => 315.2,
            'ownership' => 'Raised',
            'breeding_status' => 'Exposed',
            'notes' => 'Primary demo animal used to populate activity charts.',
        ]);

        $seedAnimal('2234', [
            'animal_name' => 'Daisy',
            'species' => 'cow',
            'type' => 'Cow',
            'status' => 'active',
            'ear_tag_color' => 'bg-yellow-400',
            'breed_id' => $breedIds['Hereford'],
            'location_id' => $locationIds['North Pasture'],
            'group_id' => $groupIds['Default Group'],
            'birth_date' => now()->subMonths(14)->toDateString(),
            'birth_weight' => 40.1,
            'ownership' => 'Purchased',
        ]);

        $seedAnimal('3345', [
            'animal_name' => 'Rosie',
            'species' => 'cow',
            'type' => 'Cow',
            'status' => 'active',
            'ear_tag_color' => 'bg-red-500',
            'breed_id' => $breedIds['Holstein'],
            'location_id' => $locationIds['North Pasture'],
            'group_id' => $groupIds['Breeding Herd'],
            'birth_date' => now()->subMonths(16)->toDateString(),
            'birth_weight' => 41.5,
            'ownership' => 'Purchased',
        ]);

        $seedAnimal('4456', [
            'animal_name' => 'Hazel',
            'species' => 'cow',
            'type' => 'Cow',
            'status' => 'active',
            'ear_tag_color' => 'bg-blue-600',
            'breed_id' => $breedIds['Jersey'],
            'location_id' => $locationIds['Breeding Barn'],
            'group_id' => $groupIds['Young Stock'],
            'birth_date' => now()->subMonths(9)->toDateString(),
            'birth_weight' => 36.7,
            'ownership' => 'Raised',
        ]);

        $seedAnimal('5010', [
            'animal_name' => 'Luna',
            'species' => 'sheep',
            'type' => 'Ewe',
            'status' => 'active',
            'ear_tag_color' => 'bg-purple-700',
            'breed_id' => $breedIds['Dorper'],
            'location_id' => $locationIds['South Pasture'],
            'group_id' => $groupIds['Young Stock'],
            'birth_date' => now()->subMonths(8)->toDateString(),
            'birth_weight' => 4.8,
            'ownership' => 'Purchased',
        ]);

        $seedAnimal('5011', [
            'animal_name' => 'Piper',
            'species' => 'sheep',
            'type' => 'Ram',
            'status' => 'active',
            'ear_tag_color' => 'bg-orange-500',
            'breed_id' => $breedIds['Merino'],
            'location_id' => $locationIds['South Pasture'],
            'group_id' => $groupIds['Default Group'],
            'birth_date' => now()->subMonths(10)->toDateString(),
            'birth_weight' => 5.1,
            'ownership' => 'Purchased',
        ]);

        $seedMovement = function (string $date, array $overrides) use ($demoUser, $heroCow): MovementRecord {
            $payload = MovementRecordFactory::new()->raw(array_merge([
                'user_id' => $demoUser->id,
                'animal_id' => $heroCow->getKey(),
                'treatment_date' => $date,
                'activity_date' => $date,
                'effective_date' => $date,
            ], $overrides));

            return MovementRecord::updateOrCreate(
                ['animal_id' => $heroCow->getKey(), 'type' => $overrides['type'], 'treatment_date' => $date],
                $payload
            );
        };

        $seedHealth = function (string $date, array $overrides) use ($demoUser, $heroCow): HealthRecord {
            $payload = HealthRecordFactory::new()->raw(array_merge([
                'user_id' => $demoUser->id,
                'animal_id' => $heroCow->getKey(),
                'treatment_date' => $date,
            ], $overrides));

            return HealthRecord::updateOrCreate(
                ['animal_id' => $heroCow->getKey(), 'type' => $overrides['type'], 'treatment_date' => $date],
                $payload
            );
        };

        $seedBreeding = function (string $date, array $overrides) use ($demoUser, $heroCow): BreedingRecord {
            $payload = BreedingRecordFactory::new()->raw(array_merge([
                'user_id' => $demoUser->id,
                'animal_id' => $heroCow->getKey(),
                'treatment_date' => $date,
                'activity_date' => $date,
            ], $overrides));

            return BreedingRecord::updateOrCreate(
                ['animal_id' => $heroCow->getKey(), 'type' => $overrides['type'], 'treatment_date' => $date],
                $payload
            );
        };

        $seedWeight = function (string $date, array $overrides) use ($demoUser, $heroCow): SalesRecord {
            $payload = SalesRecordFactory::new()->raw(array_merge([
                'user_id' => $demoUser->id,
                'animal_id' => $heroCow->getKey(),
                'type' => 'weight',
                'treatment_date' => $date,
                'sale_date' => $date,
                'payment_date' => $date,
            ], $overrides));

            return SalesRecord::updateOrCreate(
                ['animal_id' => $heroCow->getKey(), 'type' => 'weight', 'treatment_date' => $date],
                $payload
            );
        };

        $seedMovement(now()->subWeeks(11)->toDateString(), [
            'type' => 'location',
            'from_location' => $locationIds['Arsh\'s Farm'],
            'to_location' => $locationIds['North Pasture'],
            'reason' => 'Started the grazing rotation cycle',
            'moved_by' => 'Demo Farm Team',
            'notes' => 'Moved from the main barn to the north pasture.',
            'cost' => 18.00,
        ]);

        $seedMovement(now()->subWeeks(8)->toDateString(), [
            'type' => 'group',
            'from_group' => $groupIds['Breeding Herd'],
            'to_group' => $groupIds['Default Group'],
            'reason' => 'Temporary regrouping for observation',
            'moved_by' => 'Demo Farm Team',
            'notes' => 'Moved to the default group during herd review.',
            'cost' => 22.00,
        ]);

        $seedMovement(now()->subWeeks(5)->toDateString(), [
            'type' => 'location',
            'from_location' => $locationIds['North Pasture'],
            'to_location' => $locationIds['Breeding Barn'],
            'reason' => 'Vet check and breeding prep',
            'moved_by' => 'Demo Farm Team',
            'notes' => 'Moved back to the breeding barn for handling.',
            'cost' => 20.00,
        ]);

        $seedMovement(now()->subWeeks(2)->toDateString(), [
            'type' => 'location',
            'from_location' => $locationIds['Breeding Barn'],
            'to_location' => $locationIds['North Pasture'],
            'reason' => 'Returned to pasture after observation',
            'moved_by' => 'Demo Farm Team',
            'notes' => 'Returned to the pasture after the breeding review.',
            'cost' => 24.00,
        ]);

        $seedHealth(now()->subWeeks(10)->toDateString(), [
            'type' => 'vaccination',
            'observed_by' => 'Dr. Carter',
            'location' => 'Main Barn',
            'severity' => 'Low',
            'obs_type' => 'Vaccination',
            'vet_required' => 'No',
            'result' => 'Clear',
            'notes' => 'Routine vaccination completed without issues.',
            'cost' => 35.00,
        ]);

        $seedHealth(now()->subWeeks(4)->toDateString(), [
            'type' => 'treatment',
            'observed_by' => 'Dr. Carter',
            'location' => 'Breeding Barn',
            'severity' => 'Medium',
            'obs_type' => 'Lameness',
            'vet_required' => 'Yes',
            'result' => 'Monitor',
            'notes' => 'Minor hoof treatment and monitoring requested.',
            'cost' => 48.00,
        ]);

        $seedHealth(now()->subDays(9)->toDateString(), [
            'type' => 'observation',
            'observed_by' => 'Farm Assistant',
            'location' => 'North Pasture',
            'severity' => 'Low',
            'obs_type' => 'Routine Check',
            'vet_required' => 'No',
            'result' => 'Clear',
            'notes' => 'Healthy appetite and normal movement observed.',
            'cost' => 28.00,
        ]);

        $seedBreeding(now()->subWeeks(9)->toDateString(), [
            'type' => 'breeding',
            'breeding_type' => 'Natural',
            'breeding_method' => 'Natural Mating',
            'technician' => 'Demo Farm Team',
            'result' => 'Open',
            'preg_result' => 'Open',
            'notes' => 'Initial breeding activity recorded for the demo herd.',
            'cost' => 45.00,
        ]);

        $seedBreeding(now()->subWeeks(6)->toDateString(), [
            'type' => 'pregnancy_check',
            'check_method' => 'Ultrasound',
            'technician' => 'Dr. Carter',
            'result' => 'Pregnant',
            'preg_result' => 'Pregnant',
            'days_pregnant' => 145,
            'next_check_date' => now()->addWeeks(4)->toDateString(),
            'expected_calving' => now()->addWeeks(11)->toDateString(),
            'notes' => 'Pregnancy confirmed with a healthy scan.',
            'cost' => 65.00,
        ]);

        $seedBreeding(now()->subWeeks(4)->toDateString(), [
            'type' => 'calving',
            'calving_date' => now()->subWeeks(4)->toDateString(),
            'calf_ear_tag' => 'C-1234A',
            'calf_sex' => 'Female',
            'calf_gender' => 'Heifer Calf',
            'calf_weight' => 38.5,
            'calf_birth_weight' => 38.5,
            'calf_health' => 'Healthy',
            'dam_health' => 'Healthy',
            'assisted_by' => 'Demo Farm Team',
            'calving_ease' => 'Easy',
            'stillborn' => 'No',
            'notes' => 'First healthy calf for the demo farm.',
            'cost' => 120.00,
        ]);

        $seedBreeding(now()->subDays(10)->toDateString(), [
            'type' => 'calving',
            'calving_date' => now()->subDays(10)->toDateString(),
            'calf_ear_tag' => 'C-1234B',
            'calf_sex' => 'Male',
            'calf_gender' => 'Bull Calf',
            'calf_weight' => 40.2,
            'calf_birth_weight' => 40.2,
            'calf_health' => 'Healthy',
            'dam_health' => 'Healthy',
            'assisted_by' => 'Demo Farm Team',
            'calving_ease' => 'Easy',
            'stillborn' => 'No',
            'notes' => 'Second healthy calf to populate the activity summary.',
            'cost' => 110.00,
        ]);

        $seedWeight(now()->subDays(70)->toDateString(), [
            'weight' => 362.0,
            'weight_at_sale' => 362.0,
            'condition_score' => 4,
            'buyer_name' => 'Demo Farm',
            'buyer_contact' => 'N/A',
            'sale_type' => 'Weight Check',
            'quantity' => 1,
            'unit' => 'head',
            'price_per_unit' => 0,
            'total_amount' => 0,
            'payment_method' => 'N/A',
            'invoice_number' => 'WGT-1234-1',
            'notes' => 'Baseline weight measurement.',
        ]);

        $seedWeight(now()->subDays(40)->toDateString(), [
            'weight' => 391.5,
            'weight_at_sale' => 391.5,
            'condition_score' => 4,
            'buyer_name' => 'Demo Farm',
            'buyer_contact' => 'N/A',
            'sale_type' => 'Weight Check',
            'quantity' => 1,
            'unit' => 'head',
            'price_per_unit' => 0,
            'total_amount' => 0,
            'payment_method' => 'N/A',
            'invoice_number' => 'WGT-1234-2',
            'notes' => 'Follow-up weight measurement.',
        ]);

        $seedWeight(now()->subDays(10)->toDateString(), [
            'weight' => 414.2,
            'weight_at_sale' => 414.2,
            'condition_score' => 5,
            'buyer_name' => 'Demo Farm',
            'buyer_contact' => 'N/A',
            'sale_type' => 'Weight Check',
            'quantity' => 1,
            'unit' => 'head',
            'price_per_unit' => 0,
            'total_amount' => 0,
            'payment_method' => 'N/A',
            'invoice_number' => 'WGT-1234-3',
            'notes' => 'Latest weight measurement for the demo cow.',
        ]);

        $seedActivityBundle = function ($animal, int $position = 0) use ($locationIds, $groupIds): void {
            $userId = (string) ($animal->user_id ?? '');
            $animalId = (string) $animal->getKey();
            $baseOffset = 12 + ($position * 2);

            $movementDates = [
                now()->subWeeks($baseOffset)->toDateString(),
                now()->subWeeks($baseOffset - 4)->toDateString(),
                now()->subWeeks($baseOffset - 8)->toDateString(),
            ];

            foreach ($movementDates as $index => $date) {
                MovementRecord::updateOrCreate(
                    ['animal_id' => $animalId, 'type' => $index % 2 === 0 ? 'location' : 'group', 'treatment_date' => $date],
                    [
                        'user_id' => $userId,
                        'animal_id' => $animalId,
                        'type' => $index % 2 === 0 ? 'location' : 'group',
                        'treatment_date' => $date,
                        'activity_date' => $date,
                        'effective_date' => $date,
                        'from_location' => $locationIds['Arsh\'s Farm'] ?? null,
                        'to_location' => $locationIds['North Pasture'] ?? null,
                        'from_group' => $groupIds['Default Group'] ?? null,
                        'to_group' => $groupIds['Breeding Herd'] ?? null,
                        'reason' => 'Demo activity generated for chart visibility',
                        'moved_by' => 'Seeder',
                        'notes' => 'Generated demo movement history.',
                        'attachments' => [],
                        'cost' => 18 + ($index * 6),
                    ]
                );
            }

            $healthDates = [
                now()->subWeeks($baseOffset - 1)->toDateString(),
                now()->subWeeks($baseOffset - 5)->toDateString(),
            ];

            foreach ($healthDates as $index => $date) {
                HealthRecord::updateOrCreate(
                    ['animal_id' => $animalId, 'type' => $index === 0 ? 'vaccination' : 'treatment', 'treatment_date' => $date],
                    [
                        'user_id' => $userId,
                        'animal_id' => $animalId,
                        'type' => $index === 0 ? 'vaccination' : 'treatment',
                        'treatment_date' => $date,
                        'observed_by' => 'Seeder',
                        'location' => 'Demo Farm',
                        'severity' => $index === 0 ? 'Low' : 'Medium',
                        'obs_type' => $index === 0 ? 'Vaccination' : 'Observation',
                        'vet_required' => $index === 0 ? 'No' : 'Yes',
                        'result' => $index === 0 ? 'Clear' : 'Monitor',
                        'notes' => 'Generated demo health history.',
                        'attachments' => [],
                        'cost' => 28 + ($index * 12),
                    ]
                );
            }

            $breedingDates = [
                now()->subWeeks($baseOffset - 2)->toDateString(),
                now()->subWeeks($baseOffset - 6)->toDateString(),
            ];

            foreach ($breedingDates as $index => $date) {
                $type = $index === 0 ? 'breeding' : 'pregnancy_check';
                BreedingRecord::updateOrCreate(
                    ['animal_id' => $animalId, 'type' => $type, 'treatment_date' => $date],
                    [
                        'user_id' => $userId,
                        'animal_id' => $animalId,
                        'type' => $type,
                        'treatment_date' => $date,
                        'activity_date' => $date,
                        'breeding_type' => 'Natural',
                        'breeding_method' => 'Natural Mating',
                        'technician' => 'Seeder',
                        'check_method' => 'Ultrasound',
                        'result' => $index === 0 ? 'Open' : 'Pregnant',
                        'preg_result' => $index === 0 ? 'Open' : 'Pregnant',
                        'days_pregnant' => $index === 0 ? 0 : 145,
                        'next_check_date' => now()->addWeeks(4)->toDateString(),
                        'expected_calving' => now()->addWeeks(11)->toDateString(),
                        'stillborn' => 'No',
                        'notes' => 'Generated demo breeding history.',
                        'attachments' => [],
                        'cost' => 42 + ($index * 18),
                    ]
                );
            }

            $weightDates = [
                now()->subMonths(4)->toDateString(),
                now()->subMonths(2)->toDateString(),
                now()->subWeeks(2)->toDateString(),
            ];

            foreach ($weightDates as $index => $date) {
                SalesRecord::updateOrCreate(
                    ['animal_id' => $animalId, 'type' => 'weight', 'treatment_date' => $date],
                    [
                        'user_id' => $userId,
                        'animal_id' => $animalId,
                        'type' => 'weight',
                        'treatment_date' => $date,
                        'sale_date' => $date,
                        'payment_date' => $date,
                        'weight' => 240 + ($position * 15) + ($index * 18),
                        'weight_at_sale' => 240 + ($position * 15) + ($index * 18),
                        'condition_score' => 4,
                        'buyer_name' => 'Demo Farm',
                        'buyer_contact' => 'N/A',
                        'sale_type' => 'Weight Check',
                        'quantity' => 1,
                        'unit' => 'head',
                        'price_per_unit' => 0,
                        'total_amount' => 0,
                        'payment_method' => 'N/A',
                        'invoice_number' => 'WGT-' . substr($animalId, -4) . '-' . ($index + 1),
                        'notes' => 'Generated demo weight history.',
                        'attachments' => [],
                    ]
                );
            }
        };

        $allAnimals = Animal::withoutGlobalScopes()->get()
            ->merge(Cattle::withoutGlobalScopes()->get())
            ->merge(Sheep::withoutGlobalScopes()->get())
            ->unique(fn ($animal) => (string) $animal->getKey())
            ->values();

        foreach ($allAnimals as $index => $animal) {
            $seedActivityBundle($animal, $index);
        }

        $seedWorker = function (string $email, array $overrides) use ($demoUser): Worker {
            $payload = WorkerFactory::new()->raw(array_merge([
                'user_id' => $demoUser->id,
                'email' => $email,
            ], $overrides));

            return Worker::updateOrCreate(
                ['user_id' => $demoUser->id, 'email' => $email],
                $payload
            );
        };

        $seedWorker('emma@demo-farm.test', [
            'name' => 'Emma Brooks',
            'animal_id' => (string) $heroCow->getKey(),
            'group_id' => $groupIds['Breeding Herd'],
            'task' => 'Morning feeding and calving prep',
            'cost' => 180.00,
            'status' => 'On Duty',
        ]);

        $seedWorker('noah@demo-farm.test', [
            'name' => 'Noah Patel',
            'animal_id' => null,
            'group_id' => $groupIds['Default Group'],
            'task' => 'Pasture inspection and water checks',
            'cost' => 145.00,
            'status' => 'Scheduled',
        ]);

        $seedWorker('olivia@demo-farm.test', [
            'name' => 'Olivia Grant',
            'animal_id' => (string) $heroCow->getKey(),
            'group_id' => $groupIds['Young Stock'],
            'task' => 'Vaccination support and notes review',
            'cost' => 220.00,
            'status' => 'Completed',
        ]);

        $seedWorker('liam@demo-farm.test', [
            'name' => 'Liam Carter',
            'animal_id' => null,
            'group_id' => $groupIds['Breeding Herd'],
            'task' => 'Barn cleanup and inventory restock',
            'cost' => 96.00,
            'status' => 'On Duty',
        ]);

        $seedAlert = function (string $key, array $attributes) use ($demoUser): FarmNotification {
            $alert = FarmNotification::firstOrNew([
                'user_id' => $demoUser->id,
                'dedup_key' => $key,
            ]);

            $alert->forceFill(array_merge([
                'user_id' => $demoUser->id,
                'dedup_key' => $key,
            ], $attributes));

            $alert->save();

            return $alert;
        };

        $seedAlert('demo-worker-check-in', [
            'animal_id' => null,
            'category' => 'activity',
            'level' => 'info',
            'title' => 'Worker check-in completed',
            'message' => 'Emma Brooks checked in for morning feeding and calving prep.',
            'action_url' => '/farm/workers',
            'metadata' => ['source' => 'seed', 'type' => 'worker_check_in'],
            'status' => 'unread',
            'read_at' => null,
            'resolved_at' => null,
            'created_at' => now()->subMinutes(18),
            'updated_at' => now()->subMinutes(18),
        ]);

        $seedAlert('demo-pasture-inspection', [
            'animal_id' => (string) $heroCow->getKey(),
            'category' => 'attention',
            'level' => 'warning',
            'title' => 'Pasture inspection due',
            'message' => 'North Pasture needs a follow-up inspection before the next rotation.',
            'action_url' => '/farm/activity/movement',
            'metadata' => ['source' => 'seed', 'type' => 'inspection_due'],
            'status' => 'unread',
            'read_at' => null,
            'resolved_at' => null,
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        $seedAlert('demo-breeding-review', [
            'animal_id' => (string) $heroCow->getKey(),
            'category' => 'activity',
            'level' => 'success',
            'title' => 'Breeding review logged',
            'message' => 'Breeding support was recorded for Mabel this morning.',
            'action_url' => '/farm/activity/breeding',
            'metadata' => ['source' => 'seed', 'type' => 'breeding_review'],
            'status' => 'read',
            'read_at' => now()->subHour(),
            'resolved_at' => null,
            'created_at' => now()->subHours(5),
            'updated_at' => now()->subHour(),
        ]);

        $seedAlert('demo-health-followup', [
            'animal_id' => (string) $heroCow->getKey(),
            'category' => 'attention',
            'level' => 'danger',
            'title' => 'Health follow-up required',
            'message' => 'A follow-up treatment note was added for the demo cow.',
            'action_url' => '/farm/activity/health',
            'metadata' => ['source' => 'seed', 'type' => 'health_followup'],
            'status' => 'unread',
            'read_at' => null,
            'resolved_at' => null,
            'created_at' => now()->subDays(1),
            'updated_at' => now()->subDays(1),
        ]);
    }
}
