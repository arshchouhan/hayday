<?php
/**
 * app/Http/Controllers/ActivityController.php
 */

namespace App\Http\Controllers;

use App\Models\BreedingRecord;
use App\Models\MovementRecord;
use App\Models\SalesRecord;
use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ActivityController extends Controller
{
    /**
     * Generic store method for any activity.
     */
    public function store(Request $request, $hub)
    {
        $hubModels = [
            'breeding' => BreedingRecord::class,
            'movement' => MovementRecord::class,
            'sales'    => SalesRecord::class,
        ];

        if (!isset($hubModels[$hub])) {
            return response()->json(['success' => false, 'message' => 'Invalid activity hub'], 400);
        }

        // Try to resolve treatment_date from other common names if missing
        if (!$request->has('treatment_date')) {
            $dateFields = ['activity_date', 'calving_date', 'check_date', 'date', 'move_date', 'sale_date', 'payment_date'];
            foreach ($dateFields as $field) {
                if ($request->has($field)) {
                    $request->merge(['treatment_date' => $request->input($field)]);
                    break;
                }
            }
        }

        $validator = Validator::make($request->all(), [
            'animal_id'      => 'required|string',
            'type'           => 'required|string',
            'treatment_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false, 
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $animal = $this->findAnimal($request->animal_id);
            if (!$animal) {
                return response()->json(['success' => false, 'message' => 'Animal not found'], 404);
            }

            $modelClass = $hubModels[$hub];
            $record = new $modelClass();
            $record->fill($request->all());
            $record->save();

            // Special logic: Update animal state based on activity
            if ($hub === 'sales' && $request->type === 'dead') {
                $animal->update(['status' => 'Dead', 'death_date' => $request->treatment_date, 'death_cause' => $request->death_cause]);
            }

            if ($hub === 'movement') {
                if ($request->type === 'location' && $request->has('to_location')) {
                    $animal->update(['location_id' => $request->to_location]);
                }
                if ($request->type === 'group' && $request->has('to_group')) {
                    $animal->update(['group_id' => $request->to_group]);
                }
            }

            $notifications = app(NotificationService::class);
            $notifications->createActivityNotification($request->user(), $animal, [
                'category' => $hub,
                'level' => $hub === 'sales' && $request->type === 'dead' ? 'danger' : 'info',
                'title' => ucfirst($hub) . ' activity recorded',
                'message' => $this->buildActivityMessage($hub, $request->type, $animal),
                'action_url' => '/farm/details/' . $animal->id,
                'metadata' => [
                    'hub' => $hub,
                    'type' => $request->type,
                    'animal_id' => (string) $animal->id,
                ],
            ]);

            $notifications->syncAnimalAttentionNotifications($request->user(), $animal);

            return response()->json([
                'success' => true,
                'message' => 'Activity recorded successfully',
                'data'    => $record
            ], 201);

        } catch (\Exception $e) {
            Log::error("Failed to save {$hub} record: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'An error occurred'], 500);
        }
    }

    private function findAnimal($id)
    {
        return Animal::find($id) ?? Cattle::find($id) ?? Sheep::find($id);
    }

    private function buildActivityMessage($hub, $type, $animal): string
    {
        $animalLabel = $animal->ear_tag ?: $animal->animal_name ?: 'Animal ' . $animal->id;

        return match ($hub) {
            'breeding' => "{$animalLabel} breeding activity ({$type}) was saved.",
            'movement' => "{$animalLabel} movement activity ({$type}) was saved.",
            'sales' => "{$animalLabel} sales activity ({$type}) was saved.",
            default => "{$animalLabel} activity was saved.",
        };
    }

    /**
     * Get basic activity summary stats for an animal.
     */
    public function getSummary($animalId)
    {
        try {
            $animal = $this->findAnimal($animalId);
            if (!$animal) {
                return response()->json(['success' => false, 'message' => 'Animal not found'], 404);
            }

            // Calving Stats
            $calvingRecords = BreedingRecord::where('animal_id', $animalId)->where('type', 'calving')->get();
            $totalCalving = $calvingRecords->count();
            $lastCalving  = $calvingRecords->max('treatment_date');
            $aliveCalves  = $calvingRecords->where('stillborn', 'No')->count();
            $survivalRate = $totalCalving > 0 ? round(($aliveCalves / $totalCalving) * 100, 1) . '%' : 'N/A';

            $lastTreatment = \App\Models\HealthRecord::where('animal_id', $animalId)->max('treatment_date');

            return response()->json([
                'success' => true,
                'data' => [
                    'total_calving'     => $totalCalving > 0 ? $totalCalving : 'N/A',
                    'last_calving_date' => $lastCalving ? Carbon::parse($lastCalving)->format('Y-m-d') : 'N/A',
                    'survival_rate'    => $survivalRate,
                    'breeding_status'   => $animal->breeding_status ?? 'N/A',
                    'last_treatment'    => $lastTreatment ? Carbon::parse($lastTreatment)->format('Y-m-d') : 'N/A',
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getMovementHistory(Request $request, $animalId)
    {
        $period = $request->query('period', '3m');
        $months = ($period === '6m') ? 6 : (($period === '12m') ? 12 : 3);
        $since  = now()->subMonths($months);
        
        $movements = MovementRecord::where('animal_id', $animalId)->where('treatment_date', '>=', $since)->get();
        $history = [];
        
        if ($months == 3) {
            for ($i = 11; $i >= 0; $i--) {
                $start = now()->subWeeks($i)->startOfWeek();
                $end   = now()->subWeeks($i)->endOfWeek();
                $count = $movements->whereBetween('treatment_date', [$start, $end])->count();
                $history[] = ['label' => 'W' . (12 - $i), 'count' => $count];
            }
        } else {
            for ($i = $months - 1; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $count = $movements->whereBetween('treatment_date', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()])->count();
                $history[] = ['label' => $date->format('M'), 'count' => $count];
            }
        }

        return response()->json(['success' => true, 'data' => $history, 'total' => $movements->count()]);
    }

    public function getWeightHistory(Request $request, $animalId)
    {
        $animal = $this->findAnimal($animalId);
        $period = $request->query('period', '3m');
        $months = ($period === '6m') ? 6 : (($period === '12m') ? 12 : 3);
        $since  = now()->subMonths($months);

        $milestones = [];
        foreach (['birth', 'weaning', 'yearling'] as $m) {
            $dateCol = "{$m}_date";
            $weightCol = "{$m}_weight";
            if ($animal->$weightCol && $animal->$dateCol && $animal->$dateCol >= $since) {
                $milestones[] = ['date' => $animal->$dateCol->format('Y-m-d'), 'weight' => (float)$animal->$weightCol, 'label' => ucfirst(substr($m, 0, 4))];
            }
        }

        $records = SalesRecord::where('animal_id', $animalId)
            ->where('type', 'weight')
            ->where('treatment_date', '>=', $since)
            ->orderBy('treatment_date', 'asc')
            ->get()
            ->map(fn($r) => ['date' => $r->treatment_date->format('Y-m-d'), 'weight' => (float)$r->weight, 'label' => 'Rec'])
            ->toArray();

        $history = array_merge($milestones, $records);
        usort($history, fn($a, $b) => strcmp($a['date'], $b['date']));

        return response()->json(['success' => true, 'data' => $history]);
    }

    public function getCostStats(Request $request, $animalId)
    {
        $period = $request->query('period', '3m');
        $months = ($period === '6m') ? 6 : (($period === '12m') ? 12 : 3);
        $since  = now()->subMonths($months);

        $breedingCost = BreedingRecord::where('animal_id', $animalId)->where('treatment_date', '>=', $since)->sum('cost');
        $movementCost = MovementRecord::where('animal_id', $animalId)->where('treatment_date', '>=', $since)->sum('cost');
        $healthCost   = \App\Models\HealthRecord::where('animal_id', $animalId)->where('treatment_date', '>=', $since)->sum('cost');

        $total = $breedingCost + $movementCost + $healthCost;
        return response()->json(['success' => true, 'total' => $total, 'average' => 150]);
    }

    public function getTimeline($animalId)
    {
        try {
            $animal = $this->findAnimal($animalId);
            if (!$animal) return response()->json(['success' => false, 'message' => 'Animal not found'], 404);

            $events = [];

            // 1. Birth Event
            if ($animal->birth_date) {
                $events[] = [
                    'type' => 'birth',
                    'title' => 'Born at Farm',
                    'date' => Carbon::parse($animal->birth_date)->format('M d, Y'),
                    'description' => "Successfully registered. Birth weight: " . ($animal->birth_weight ?? 'N/A') . " kg.",
                    'meta' => [
                        'Status' => $animal->status ?? 'Healthy',
                        'Method' => $animal->conception ?? 'Natural'
                    ],
                    'raw_date' => $animal->birth_date
                ];
            }

            // 2. Health Records
            $health = \App\Models\HealthRecord::where('animal_id', $animalId)->get();
            foreach ($health as $r) {
                $events[] = [
                    'type' => 'vaccination', // simplified for icon
                    'title' => ucfirst($r->type) . ($r->obs_type ? " ({$r->obs_type})" : ""),
                    'date' => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'description' => $r->notes ?? "Recorded health activity: {$r->type}",
                    'meta' => array_filter([
                        'Severity' => $r->severity,
                        'Vet' => $r->vet_name,
                        'Cost' => $r->cost ? "$".$r->cost : null
                    ]),
                    'raw_date' => $r->treatment_date
                ];
            }

            // 3. Movement Records
            $movements = MovementRecord::where('animal_id', $animalId)->get();
            foreach ($movements as $r) {
                $events[] = [
                    'type' => 'movement',
                    'title' => $r->type === 'location' ? 'Location Change' : 'Group Transfer',
                    'date' => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'description' => $r->notes ?? "Animal moved to " . ($r->to_location ?? $r->to_group ?? 'new area'),
                    'meta' => array_filter([
                        'From' => $r->from_location ?? $r->from_group,
                        'To' => $r->to_location ?? $r->to_group,
                        'Cost' => $r->cost ? "$".$r->cost : null
                    ]),
                    'raw_date' => $r->treatment_date
                ];
            }

            // 4. Breeding Records
            $breeding = BreedingRecord::where('animal_id', $animalId)->get();
            foreach ($breeding as $r) {
                $events[] = [
                    'type' => 'activity',
                    'title' => ucfirst($r->type),
                    'date' => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'description' => $r->notes ?? "Breeding activity recorded.",
                    'meta' => array_filter([
                        'Method' => $r->breeding_method,
                        'Result' => $r->result ?? $r->preg_result,
                        'Cost' => $r->cost ? "$".$r->cost : null
                    ]),
                    'raw_date' => $r->treatment_date
                ];
            }

            // 5. Weight Records (from SalesRecord type weight)
            $weights = SalesRecord::where('animal_id', $animalId)->where('type', 'weight')->get();
            foreach ($weights as $r) {
                $events[] = [
                    'type' => 'activity',
                    'title' => 'Weight Measurement',
                    'date' => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'description' => "Recorded weight: {$r->weight}kg.",
                    'meta' => ['Trend' => 'Positive'],
                    'raw_date' => $r->treatment_date
                ];
            }

            // Sort by date descending
            usort($events, fn($a, $b) => strcmp($b['raw_date'], $a['raw_date']));

            return response()->json(['success' => true, 'data' => $events]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
