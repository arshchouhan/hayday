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
            $notifications->logActivityAlert([
                'category' => 'activity',
                'level' => $hub === 'sales' && $request->type === 'dead' ? 'danger' : 'info',
                'title' => ucfirst($hub) . ' activity recorded',
                'message' => $this->buildActivityMessage($hub, $request->type, $animal),
                'action_url' => '/farm/details/' . $animal->id,
                'animal_id' => (string) $animal->id,
                'metadata' => [
                    'hub' => $hub,
                    'type' => $request->type,
                    'animal_id' => (string) $animal->id,
                ],
            ], $request->user());

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

        $animal = $this->findAnimal($animalId);
        if (!$animal) {
            return response()->json(['success' => false, 'message' => 'Animal not found or unauthorized'], 404);
        }

        $baseQuery = MovementRecord::where('animal_id', $animalId)
            ->get()
            ->map(function ($record) {
                $record->normalized_treatment_date = Carbon::parse($record->treatment_date);
                return $record;
            })
            ->unique('_id')
            ->sortBy(fn ($r) => $r->normalized_treatment_date->timestamp)
            ->values();

        // ── Location movements (for location Gantt rows) ─────────────────────
        $locationCache = [];
        $allLocationMovements = $baseQuery->filter(fn ($r) => $r->type === 'location')->values();

        $movementRecords = $allLocationMovements->map(function ($record) use (&$locationCache) {
            $locationId = $record->to_location;
            $locationData = null;
            if ($locationId) {
                if (!isset($locationCache[$locationId])) {
                    $locationCache[$locationId] = $this->resolveLocationLabel($locationId);
                }
                $locationData = $locationCache[$locationId];
            }
            $fromLocationData = null;
            if ($record->from_location) {
                if (!isset($locationCache[$record->from_location])) {
                    $locationCache[$record->from_location] = $this->resolveLocationLabel($record->from_location);
                }
                $fromLocationData = $locationCache[$record->from_location] ?? null;
            }
            if (!$locationData && $locationId) {
                $locationData = [
                    'id' => (string) $locationId,
                    'name' => (string) $locationId,
                ];
            }
            if (!$fromLocationData && $record->from_location) {
                $fromLocationData = [
                    'id' => (string) $record->from_location,
                    'name' => (string) $record->from_location,
                ];
            }
            return [
                'id'       => (string) $record->_id,
                'date'     => $record->normalized_treatment_date->format('Y-m-d'),
                'type'     => 'location',
                'location' => $locationData,
                'from_location' => $fromLocationData,
                'notes'    => $record->notes,
            ];
        })->values();

        // ── Group movements (for group Gantt rows) ───────────────────────────
        // to_group is stored as a plain string (group name), no DB lookup needed
        $allGroupMovements = $baseQuery->filter(fn ($r) => $r->type === 'group')->values();

        $groupMovementRecords = $allGroupMovements->map(function ($record) {
            $groupName = $record->to_group;
            return [
                'id'    => (string) $record->_id,
                'date'  => $record->normalized_treatment_date->format('Y-m-d'),
                'type'  => 'group',
                'group' => $groupName ? ['id' => $groupName, 'name' => $groupName] : null,
                'from_group' => $record->from_group,
                'notes' => $record->notes,
            ];
        })->values();

        // ── Legacy bucket counts ──────────────────────────────────────────────
        $periodMovements = $allLocationMovements->filter(
            fn ($r) => $r->normalized_treatment_date->gte($since)
        )->values();

        $history = [];
        $bucketCounts = [];
        foreach ($periodMovements as $record) {
            $bucketKey = $record->normalized_treatment_date->format('Y-m');
            $bucketCounts[$bucketKey] = ($bucketCounts[$bucketKey] ?? 0) + 1;
        }
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = $bucketCounts[$date->format('Y-m')] ?? 0;
            $label = ($period === '3m') ? $date->format('M') : $date->format('M Y');
            $history[] = ['label' => $label, 'count' => $count];
        }

        $currentLocation = $animal?->location_id ? $this->resolveLocationLabel($animal->location_id) : null;

        if (!$currentLocation) {
            $latestLocationMove = $allLocationMovements->sortByDesc(fn ($r) => $r->normalized_treatment_date->timestamp)->first();
            if ($latestLocationMove?->to_location) {
                $currentLocation = $this->resolveLocationLabel($latestLocationMove->to_location) ?? [
                    'id' => (string) $latestLocationMove->to_location,
                    'name' => (string) $latestLocationMove->to_location,
                ];
            }
        }

        return response()->json([
            'success'          => true,
            'data'             => $history,
            'movements'        => $movementRecords,
            'group_movements'  => $groupMovementRecords,
            'total'            => $allLocationMovements->count() + $allGroupMovements->count(),
            'current_location' => $currentLocation,
        ]);
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
            $dateValue = $animal->$dateCol ? Carbon::parse($animal->$dateCol) : null;
            if ($animal->$weightCol && $dateValue && $dateValue->gte($since)) {
                $milestones[] = ['date' => $dateValue->format('Y-m-d'), 'weight' => (float)$animal->$weightCol, 'label' => ucfirst(substr($m, 0, 4))];
            }
        }

        $records = SalesRecord::where('animal_id', $animalId)
            ->where('type', 'weight')
            ->get()
            ->map(function ($r) use ($since) {
                $dateValue = Carbon::parse($r->treatment_date);
                if ($dateValue->lt($since)) {
                    return null;
                }

                return ['date' => $dateValue->format('Y-m-d'), 'weight' => (float)$r->weight, 'label' => 'Rec'];
            })
            ->filter()
            ->sortBy('date')
            ->values()
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

        // ── Per-category records with individual cost items ──────────────────
        $healthRecords    = \App\Models\HealthRecord::where('animal_id', $animalId)
            ->where('treatment_date', '>=', $since)
            ->get(['treatment_date', 'type', 'obs_type', 'cost', 'notes']);

        $movementRecords  = MovementRecord::where('animal_id', $animalId)
            ->where('treatment_date', '>=', $since)
            ->get(['treatment_date', 'type', 'to_location', 'to_group', 'cost', 'notes']);

        $breedingRecords  = BreedingRecord::where('animal_id', $animalId)
            ->where('treatment_date', '>=', $since)
            ->get(['treatment_date', 'type', 'cost', 'notes']);

        // ── Inventory Restock Costs (Allocated per animal) ────────────────────
        $inventoryRecords = \App\Models\InventoryHistory::where('purchase_date', '>=', $since)
            ->get(['purchase_date', 'cost_per_animal', 'inventory_id', 'cost']);

        $healthCost    = $healthRecords->sum('cost');
        $movementCost  = $movementRecords->sum('cost');
        $breedingCost  = $breedingRecords->sum('cost');
        $inventoryCost = $inventoryRecords->sum('cost_per_animal');

        $total         = $healthCost + $movementCost + $breedingCost + $inventoryCost;

        // ── Build breakdown array for the tooltip ────────────────────────────
        $breakdown = [];

        if ($healthCost > 0) {
            $breakdown[] = [
                'category' => 'Health & Treatment',
                'amount'   => round($healthCost, 2),
                'count'    => $healthRecords->where('cost', '>', 0)->count(),
                'items'    => $healthRecords->where('cost', '>', 0)->map(fn($r) => [
                    'date'   => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'label'  => ucfirst($r->type) . ($r->obs_type ? " ({$r->obs_type})" : ''),
                    'amount' => round($r->cost, 2),
                ])->values(),
            ];
        }

        if ($movementCost > 0) {
            $breakdown[] = [
                'category' => 'Movement & Transport',
                'amount'   => round($movementCost, 2),
                'count'    => $movementRecords->where('cost', '>', 0)->count(),
                'items'    => $movementRecords->where('cost', '>', 0)->map(fn($r) => [
                    'date'   => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'label'  => $r->type === 'group'
                        ? 'Group Transfer → ' . ($r->to_group ?? '—')
                        : 'Location Move → ' . ($r->to_location ?? '—'),
                    'amount' => round($r->cost, 2),
                ])->values(),
            ];
        }

        if ($breedingCost > 0) {
            $breakdown[] = [
                'category' => 'Breeding',
                'amount'   => round($breedingCost, 2),
                'count'    => $breedingRecords->where('cost', '>', 0)->count(),
                'items'    => $breedingRecords->where('cost', '>', 0)->map(fn($r) => [
                    'date'   => Carbon::parse($r->treatment_date)->format('M d, Y'),
                    'label'  => ucfirst($r->type ?? 'Breeding Activity'),
                    'amount' => round($r->cost, 2),
                ])->values(),
            ];
        }

        if ($inventoryCost > 0) {
            $breakdown[] = [
                'category' => 'Inventory & Feed',
                'amount'   => round($inventoryCost, 2),
                'count'    => $inventoryRecords->where('cost_per_animal', '>', 0)->count(),
                'items'    => $inventoryRecords->where('cost_per_animal', '>', 0)->map(function($r) {
                    $invItem = \App\Models\Inventory::find($r->inventory_id);
                    return [
                        'date'   => Carbon::parse($r->purchase_date)->format('M d, Y'),
                        'label'  => 'Restock: ' . ($invItem->name ?? 'Unknown Item'),
                        'amount' => round($r->cost_per_animal, 2),
                    ];
                })->values(),
            ];
        }

        return response()->json([
            'success'    => true,
            'total'      => round($total, 2),
            'average'    => 150,
            'breakdown'  => $breakdown,
        ]);
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

    public function getLocationMovementHistory(Request $request, $locationId)
    {
        $period = $request->query('period', '3m');
        $months = ($period === '6m') ? 6 : (($period === '12m') ? 12 : 3);
        $since = now()->subMonths($months);

        $movements = MovementRecord::where('to_location', $locationId)
            ->get()
            ->map(function ($record) {
                $record->normalized_treatment_date = Carbon::parse($record->treatment_date);
                return $record;
            })
            ->filter(fn ($record) => $record->normalized_treatment_date->gte($since))
            ->values();

        $history = [];
        $bucketCounts = [];

        foreach ($movements as $record) {
            $bucketKey = $record->normalized_treatment_date->format('Y-m');
            $bucketCounts[$bucketKey] = ($bucketCounts[$bucketKey] ?? 0) + 1;
        }

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = $bucketCounts[$date->format('Y-m')] ?? 0;
            
            // Format labels based on period
            if ($period === '3m') {
                $label = $date->format('M');
            } else {
                $label = $date->format('M Y');
            }
            
            $history[] = ['label' => $label, 'count' => $count];
        }

        return response()->json(['success' => true, 'data' => $history, 'total' => $movements->count()]);
    }

    /**
     * Get insights for the activity dashboard (Pregnant animals and Watchlist).
     */
    public function getDashboardInsights(Request $request)
    {
        try {
            // 1. Ready for Calving (Pregnant animals)
            // Cattle collection contains the breeding_status
            $calvingReady = Cattle::where('breeding_status', 'Pregnant')
                ->limit(5)
                ->get()
                ->map(function ($animal) {
                    return [
                        'id' => (string) $animal->id,
                        'ear_tag' => $animal->ear_tag,
                        'status' => 'Pregnant',
                        'type' => 'cow'
                    ];
                });

            // 2. Animals to keep an eye on (Watchlist)
            // Recent breeding or health activities in the last 48 hours
            $since = now()->subHours(48);

            $recentBreeding = BreedingRecord::where('created_at', '>=', $since)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            $recentHealth = \App\Models\HealthRecord::where('created_at', '>=', $since)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            $watchlist = [];

            foreach ($recentBreeding as $rb) {
                $animal = $this->findAnimal($rb->animal_id);
                if ($animal) {
                    $watchlist[] = [
                        'animal_id' => (string) $animal->id,
                        'ear_tag' => $animal->ear_tag,
                        'activity' => ucfirst($rb->type) . ' recorded',
                        'time_ago' => $rb->created_at->diffForHumans(),
                        'type' => 'breeding'
                    ];
                }
            }

            foreach ($recentHealth as $rh) {
                $animal = $this->findAnimal($rh->animal_id);
                if ($animal) {
                    $watchlist[] = [
                        'animal_id' => (string) $animal->id,
                        'ear_tag' => $animal->ear_tag,
                        'activity' => ucfirst($rh->type) . ' treatment',
                        'time_ago' => $rh->created_at->diffForHumans(),
                        'type' => 'health'
                    ];
                }
            }

            // Sort watchlist by created_at equivalent (implicitly handled by how we build it if we wanted strict, but these are top 5 of each)
            
            return response()->json([
                'success' => true,
                'data' => [
                    'calving_ready' => $calvingReady,
                    'watchlist' => array_slice($watchlist, 0, 5) // Top 5 combined
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function resolveLocationLabel($locationId)
    {
        if (!$locationId) {
            return null;
        }
        
        $location = \App\Models\Location::find($locationId);
        if (!$location) {
            return null;
        }

        return [
            'id' => (string)$location->id,
            'name' => $location->name,
            'type' => $location->type,
            'color' => $location->location_color ?? '#10B981'
        ];
    }
}
