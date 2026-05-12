<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\AnimalAttachment;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Models\Breed;
use App\Models\Location;
use App\Models\Group;
use App\Models\Worker;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

class AnimalController extends Controller
{
    public function index()
    {
        // Fetch from all collections - Global Scope handles user isolation
        $animals = Animal::with(['breed', 'location', 'group'])->get();
        $cattle = Cattle::with(['breed', 'location', 'group'])->get();
        $sheep = Sheep::with(['breed', 'location', 'group'])->get();
        
        $combined = $animals->merge($cattle)->merge($sheep)->sortByDesc('created_at')->values();
        
        return response()->json($combined);
    }

    public function paginatedIndex(Request $request)
    {
        $page = max((int) $request->query('page', 1), 1);
        $perPage = min(max((int) $request->query('per_page', 12), 1), 50);
        $skip = ($page - 1) * $perPage;

        $search = trim((string) $request->query('search', ''));
        $locationId = $request->query('location_id');
        $groupId = $request->query('group_id');

        $matchStage = [];

        // Authentication filter - REQUIRED
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $matchStage['user_id'] = (string) $userId;

        if ($search !== '') {
            $matchStage['ear_tag'] = [
                '$regex' => preg_quote($search, '/'),
                '$options' => 'i',
            ];
        }

        if (!blank($locationId)) {
            $matchStage['location_id'] = $locationId;
        }

        if (!blank($groupId)) {
            $matchStage['group_id'] = $groupId;
        }

        $filterPipeline = $matchStage ? [['$match' => $matchStage]] : [];

        $resultSet = Animal::query()->getQuery()->raw(function ($collection) use ($filterPipeline, $skip, $perPage) {
            $pipeline = $filterPipeline;

            $pipeline[] = ['$unionWith' => [
                'coll' => (new Cattle())->getTable(),
                'pipeline' => $filterPipeline,
            ]];

            $pipeline[] = ['$unionWith' => [
                'coll' => (new Sheep())->getTable(),
                'pipeline' => $filterPipeline,
            ]];

            $pipeline[] = ['$sort' => ['created_at' => -1, '_id' => -1]];
            $pipeline[] = ['$facet' => [
                'data' => [
                    ['$skip' => $skip],
                    ['$limit' => $perPage],
                ],
                'meta' => [
                    ['$count' => 'total'],
                ],
                'summary' => [
                    ['$group' => [
                        '_id' => null,
                        'locationIds' => ['$addToSet' => '$location_id'],
                        'groupIds' => ['$addToSet' => '$group_id'],
                    ]],
                    ['$project' => [
                        '_id' => 0,
                        'location_count' => ['$size' => ['$setDifference' => ['$locationIds', [null, '']]]],
                        'group_count' => ['$size' => ['$setDifference' => ['$groupIds', [null, '']]]],
                    ]],
                ],
            ]];

            return $collection->aggregate($pipeline);
        });

        $result = iterator_to_array($resultSet, false)[0] ?? [];
        
        // Fetch all workers to build a lookup
        $workers = Worker::where('user_id', $userId)->get();
        $animalWorkerMap = [];
        $groupWorkerMap = [];
        foreach ($workers as $w) {
            if ($w->animal_id) {
                $animalWorkerMap[$w->animal_id][] = $w->name;
            }
            if ($w->group_id) {
                $groupWorkerMap[$w->group_id][] = $w->name;
            }
        }

        $rows = array_map(
            function($doc) use ($animalWorkerMap, $groupWorkerMap) {
                $normalized = $this->normalizeMongoDocument($doc);
                $id = $normalized['id'] ?? $normalized['_id'];
                $groupId = $normalized['group_id'] ?? null;
                
                $assignedWorkers = $animalWorkerMap[(string)$id] ?? [];
                if ($groupId && isset($groupWorkerMap[(string)$groupId])) {
                    $assignedWorkers = array_merge($assignedWorkers, $groupWorkerMap[(string)$groupId]);
                }
                
                $normalized['assigned_worker'] = !empty($assignedWorkers) ? implode(', ', array_unique($assignedWorkers)) : 'N/A';
                return $normalized;
            },
            $this->toPhpArray($result['data'] ?? [])
        );
        $meta = $this->toPhpArray($result['meta'] ?? []);
        $summaryRows = $this->toPhpArray($result['summary'] ?? []);

        $total = $meta[0]['total'] ?? 0;
        $summary = $summaryRows[0] ?? [];
        $workerCount = Worker::where('user_id', $userId)->count();

        return response()->json([
            'data' => $rows,
            'meta' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'last_page' => (int) max(1, ceil($total / $perPage)),
                'location_count' => $summary['location_count'] ?? 0,
                'group_count' => $summary['group_count'] ?? 0,
                'worker_count' => $workerCount,
            ],
        ]);
    }

    private function normalizeMongoDocument(mixed $document): array
    {
        if ($document instanceof \MongoDB\Model\BSONDocument) {
            $document = $document->getArrayCopy();
        }

        if ($document instanceof \MongoDB\Model\BSONArray) {
            $document = $document->getArrayCopy();
        }

        $normalized = [];

        foreach ($document as $key => $value) {
            if ($key === '_id') {
                $normalized['id'] = $this->normalizeMongoValue($value);
                $normalized['_id'] = $normalized['id'];
                continue;
            }

            $normalized[$key] = $this->normalizeMongoValue($value);
        }

        return $normalized;
    }

    private function normalizeMongoValue(mixed $value): mixed
    {
        if ($value instanceof ObjectId) {
            return (string) $value;
        }

        if ($value instanceof UTCDateTime) {
            return $value->toDateTime()->format(DATE_ATOM);
        }

        if (is_array($value)) {
            $normalized = [];

            foreach ($value as $key => $item) {
                $normalized[$key] = $this->normalizeMongoValue($item);
            }

            return $normalized;
        }

        if (is_object($value)) {
            return $this->normalizeMongoValue((array) $value);
        }

        return $value;
    }

    private function toPhpArray(mixed $value): array
    {
        if ($value instanceof \MongoDB\Model\BSONArray) {
            $value = $value->getArrayCopy();
        }

        if ($value instanceof \Traversable) {
            $value = iterator_to_array($value, false);
        }

        return is_array($value) ? $value : [];
    }

    public function show($id)
    {
        // Step 1: cheap ID-only lookup to identify the owning collection
        $modelClass = null;
        if (Animal::whereId($id)->exists()) {
            $modelClass = Animal::class;
        } elseif (Cattle::whereId($id)->exists()) {
            $modelClass = Cattle::class;
        } elseif (Sheep::whereId($id)->exists()) {
            $modelClass = Sheep::class;
        }

        if (!$modelClass) {
            return response()->json(['message' => 'Animal not found'], 404);
        }

        // Step 2: single eager-load for normal relations
        $animal = $modelClass::with(['breed', 'location', 'group', 'attachments'])->find($id);
        $animalId = (string) $animal->id;

        $safeId = function ($value) {
            $id = (string) ($value ?? '');
            return $id === '' ? null : $id;
        };

        $isInvalidParentLink = function (?string $parentId, string $childId): bool {
            return $parentId !== null && $parentId === $childId;
        };

        $sireId = $safeId($animal->sire_id);
        $damId = $safeId($animal->dam_id);

        // If both direct parents are accidentally same record, prefer sire and clear dam for display.
        if ($sireId !== null && $damId !== null && $sireId === $damId) {
            $damId = null;
        }

        // Manually populate pedigree to bypass MongoDB cross-collection strictness
        $sire = null;
        if ($sireId !== null && !$isInvalidParentLink($sireId, $animalId)) {
            $candidateSire = $this->findAnimalAcrossCollections($sireId);
            if ($candidateSire && (string) $candidateSire->id !== $animalId) {
                $sire = $candidateSire;
            }
        }

        $dam = null;
        if ($damId !== null && !$isInvalidParentLink($damId, $animalId)) {
            $candidateDam = $this->findAnimalAcrossCollections($damId);
            if ($candidateDam && (string) $candidateDam->id !== $animalId) {
                $dam = $candidateDam;
            }
        }

        if ($sire) {
            $sireIdStr = (string) $sire->id;
            $sireSireId = $safeId($sire->sire_id);
            $sireDamId = $safeId($sire->dam_id);

            if ($sireSireId !== null && $sireSireId !== $animalId && $sireSireId !== $sireIdStr) {
                $gSire = $this->findAnimalAcrossCollections($sireSireId);
                if ($gSire && (string) $gSire->id !== $animalId && (string) $gSire->id !== $sireIdStr) {
                    $sire->setRelation('sire', $gSire);
                }
            }

            if ($sireDamId !== null && $sireDamId !== $animalId && $sireDamId !== $sireIdStr) {
                $gDam = $this->findAnimalAcrossCollections($sireDamId);
                if ($gDam && (string) $gDam->id !== $animalId && (string) $gDam->id !== $sireIdStr) {
                    $sire->setRelation('dam', $gDam);
                }
            }

            $animal->setRelation('sire', $sire);
        }

        if ($dam) {
            $damIdStr = (string) $dam->id;
            $damSireId = $safeId($dam->sire_id);
            $damDamId = $safeId($dam->dam_id);

            if ($damSireId !== null && $damSireId !== $animalId && $damSireId !== $damIdStr) {
                $gSire2 = $this->findAnimalAcrossCollections($damSireId);
                if ($gSire2 && (string) $gSire2->id !== $animalId && (string) $gSire2->id !== $damIdStr) {
                    $dam->setRelation('sire', $gSire2);
                }
            }

            if ($damDamId !== null && $damDamId !== $animalId && $damDamId !== $damIdStr) {
                $gDam2 = $this->findAnimalAcrossCollections($damDamId);
                if ($gDam2 && (string) $gDam2->id !== $animalId && (string) $gDam2->id !== $damIdStr) {
                    $dam->setRelation('dam', $gDam2);
                }
            }

            $animal->setRelation('dam', $dam);
        }

        return response()->json($animal);
    }

    private function findAnimalAcrossCollections($id)
    {
        if (blank($id)) return null;
        
        // Eager load relations for the ancestor so Breed/Location show up in the pedigree tree
        return Animal::with(['breed', 'location'])->find($id) 
            ?? Cattle::with(['breed', 'location'])->find($id) 
            ?? Sheep::with(['breed', 'location'])->find($id);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ear_tag' => 'nullable|string|max:255',
            'animal_name' => 'nullable|string|max:255',
            'species' => 'nullable|string|max:255',
            'electronic_id' => 'nullable|string|max:255',
            'ear_tag_color' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,dead,sold,reference',
            'type' => 'nullable|string|max:255',
            'breed_id' => 'nullable|string',
            'location_id' => 'nullable|string',
            'group_id' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_weight' => 'nullable|numeric',
            'conception' => 'nullable|in:natural,ai,ivf',
            'sire_id' => 'nullable|string',
            'dam_id' => 'nullable|string',
            'weaning_date' => 'nullable|date',
            'weaning_weight' => 'nullable|numeric',
            'yearling_date' => 'nullable|date',
            'yearling_weight' => 'nullable|numeric',
            'ownership' => 'nullable|in:purchased,raised',
            'notes' => 'nullable|string',
            'sex' => 'nullable|string|max:255',
            'breeding_status' => 'nullable|string|max:255',
            'death_date' => 'nullable|date',
            'death_cause' => 'nullable|string|max:255',
            'castration_date' => 'nullable|date',
            'castration_method' => 'nullable|string|max:255',
            'donor_cow_id' => 'nullable|string',
            'attachment_files.*' => 'nullable|file|max:5120',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::warning('Validation failed for animal registration:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Determine which model to use based on species for persistence
        $species = strtolower($request->input('species'));
        // Choose the correct model instance
        if (in_array($species, ['cow', 'cattle'])) {
            $animal = new \App\Models\Cattle();
        } elseif ($species === 'sheep') {
            $animal = new \App\Models\Sheep();
        } else {
            $animal = new \App\Models\Animal();
        }
        // Fill and save the model
        $animal->fill($request->all());
        
        // Assign user_id
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }
        $animal->user_id = $userId;

        $saved = $animal->save();
        if (! $saved) {
            throw new \Exception('Model save() returned false');
        }

        $this->storeAttachments($request, $animal);
        \Illuminate\Support\Facades\Log::info('Animal saved successfully ID: ' . $animal->id);

        $notifications = app(NotificationService::class);
        $notifications->logActivityAlert([
            'category' => 'activity',
            'level' => 'info',
            'title' => 'Animal registered',
            'message' => $this->animalNotificationMessage($animal, 'was registered on the farm.'),
            'action_url' => '/farm/details/' . $animal->id,
            'animal_id' => (string) $animal->id,
            'metadata' => [
                'event' => 'animal_registered',
                'animal_id' => (string) $animal->id,
            ],
        ], $request->user());

        $notifications->syncAnimalAttentionNotifications($request->user(), $animal);

        return response()->json([
            'success' => true,
            'message' => ucfirst($species) . ' registered successfully',
            'data' => $animal
        ], 201);
    }

    public function getFormData()
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $sires = Animal::where('user_id', $userId)->whereIn('type', ['bull', 'ram', 'steer'])->get(['id', 'ear_tag', 'animal_name'])
            ->merge(Cattle::where('user_id', $userId)->whereIn('type', ['bull', 'ram', 'steer'])->get(['id', 'ear_tag', 'animal_name']))
            ->merge(Sheep::where('user_id', $userId)->whereIn('type', ['bull', 'ram', 'steer'])->get(['id', 'ear_tag', 'animal_name']));
            
        $dams = Animal::where('user_id', $userId)->whereIn('type', ['cow', 'ewe', 'replacement_heifer'])->get(['id', 'ear_tag', 'animal_name'])
            ->merge(Cattle::where('user_id', $userId)->whereIn('type', ['cow', 'ewe', 'replacement_heifer'])->get(['id', 'ear_tag', 'animal_name']))
            ->merge(Sheep::where('user_id', $userId)->whereIn('type', ['cow', 'ewe', 'replacement_heifer'])->get(['id', 'ear_tag', 'animal_name']));

        return response()->json([
            'breeds' => Breed::where('user_id', $userId)->get(),
            'locations' => Location::where('user_id', $userId)->get(),
            'groups' => Group::where('user_id', $userId)->get(),
            'sires' => $sires,
            'dams' => $dams,
        ]);
    }

    public function search(Request $request)
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $type = $request->query('type'); // male or female
        
        if ($type === 'male') {
            $types = ['bull', 'ram', 'steer', 'Bull', 'Ram', 'Steer'];
        } else {
            $types = ['cow', 'ewe', 'replacement_heifer', 'Cow', 'Ewe', 'Replacement_heifer'];
        }

        $results = Animal::where('user_id', $userId)->whereIn('type', $types)->get()
            ->concat(Cattle::where('user_id', $userId)->whereIn('type', $types)->get())
            ->concat(Sheep::where('user_id', $userId)->whereIn('type', $types)->get());

        if ($request->has('species') && !empty($request->query('species'))) {
            $targetSpecies = strtolower(trim($request->query('species')));
            $results = $results->filter(function($item) use ($targetSpecies) {
                return strtolower(trim($item->species)) === $targetSpecies;
            })->values();
        }

        \Illuminate\Support\Facades\Log::info("Search API type $type returned " . $results->count() . " animals for user $userId");

        return response()->json($results);
    }

    public function update(Request $request, $id)
    {
        // Find the animal across collections
        $animal = Animal::find($id) ?? Cattle::find($id) ?? Sheep::find($id);
        if (!$animal) return response()->json(['message' => 'Animal not found'], 404);

        // Guard pedigree assignments to avoid self/looped lineage.
        if ($request->has('sire_id') || $request->has('dam_id')) {
            $incomingSireId = $request->has('sire_id') ? (string) ($request->input('sire_id') ?? '') : (string) ($animal->sire_id ?? '');
            $incomingDamId = $request->has('dam_id') ? (string) ($request->input('dam_id') ?? '') : (string) ($animal->dam_id ?? '');
            $animalId = (string) $animal->id;

            if ($incomingSireId !== '' && $incomingSireId === $animalId) {
                return response()->json([
                    'message' => 'Invalid pedigree assignment.',
                    'errors' => ['sire_id' => ['An animal cannot be its own sire.']],
                ], 422);
            }

            if ($incomingDamId !== '' && $incomingDamId === $animalId) {
                return response()->json([
                    'message' => 'Invalid pedigree assignment.',
                    'errors' => ['dam_id' => ['An animal cannot be its own dam.']],
                ], 422);
            }

            if ($incomingSireId !== '' && $incomingDamId !== '' && $incomingSireId === $incomingDamId) {
                return response()->json([
                    'message' => 'Invalid pedigree assignment.',
                    'errors' => ['dam_id' => ['Sire and dam must be different animals.']],
                ], 422);
            }

            // Prevent immediate two-node cycles: child -> parent and parent -> child
            if ($incomingSireId !== '') {
                $sire = $this->findAnimalAcrossCollections($incomingSireId);
                if ($sire && ((string) ($sire->sire_id ?? '') === $animalId || (string) ($sire->dam_id ?? '') === $animalId)) {
                    return response()->json([
                        'message' => 'Invalid pedigree assignment.',
                        'errors' => ['sire_id' => ['Selected sire creates a circular pedigree link.']],
                    ], 422);
                }
            }

            if ($incomingDamId !== '') {
                $dam = $this->findAnimalAcrossCollections($incomingDamId);
                if ($dam && ((string) ($dam->sire_id ?? '') === $animalId || (string) ($dam->dam_id ?? '') === $animalId)) {
                    return response()->json([
                        'message' => 'Invalid pedigree assignment.',
                        'errors' => ['dam_id' => ['Selected dam creates a circular pedigree link.']],
                    ], 422);
                }
            }
        }

        $animal->update($request->all());

        $this->storeAttachments($request, $animal);

        $notifications = app(NotificationService::class);
        $notifications->logActivityAlert([
            'category' => 'activity',
            'level' => 'info',
            'title' => 'Animal details updated',
            'message' => $this->animalNotificationMessage($animal, 'details were updated.'),
            'action_url' => '/farm/details/' . $animal->id,
            'animal_id' => (string) $animal->id,
            'metadata' => [
                'event' => 'animal_updated',
                'animal_id' => (string) $animal->id,
            ],
            'dedup_key' => 'animal_updated_' . $animal->id . '_' . now()->format('YmdHi'), // Dedup per minute per animal
        ], $request->user());

        $notifications->syncAnimalAttentionNotifications($request->user(), $animal);

        return response()->json(['success' => true, 'data' => $animal]);
    }

    public function destroy($id)
    {
        $animal = Animal::find($id) ?? Cattle::find($id) ?? Sheep::find($id);
        if (!$animal) return response()->json(['message' => 'Animal not found'], 404);

        $animalLabel = $this->animalNotificationMessage($animal, 'was removed from the farm.');

        $animal->delete();

        app(NotificationService::class)->logActivityAlert([
            'category' => 'activity',
            'level' => 'warning',
            'title' => 'Animal deleted',
            'message' => $animalLabel,
            'action_url' => '/farm/animals',
            'animal_id' => (string) $id,
            'metadata' => [
                'event' => 'animal_deleted',
                'animal_id' => (string) $id,
            ],
        ], request()->user());

        return response()->json(['success' => true, 'message' => 'Animal deleted successfully']);
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) return response()->json(['message' => 'No IDs provided'], 400);

        // Delete from all possible collections
        Animal::whereIn('_id', $ids)->delete();
        Cattle::whereIn('_id', $ids)->delete();
        Sheep::whereIn('_id', $ids)->delete();

        app(NotificationService::class)->logActivityAlert([
            'category' => 'activity',
            'level' => 'warning',
            'title' => 'Animals deleted',
            'message' => 'Multiple animals were removed from the farm.',
            'action_url' => '/farm/animals',
            'metadata' => [
                'event' => 'animals_bulk_deleted',
                'count' => count($ids),
                'animal_ids' => array_values($ids),
            ],
        ], $request->user());

        return response()->json(['success' => true, 'message' => 'Animals deleted successfully']);
    }

    private function animalNotificationMessage($animal, string $suffix): string
    {
        $animalLabel = $animal->ear_tag ?: $animal->animal_name ?: 'Animal ' . $animal->id;

        return "{$animalLabel} {$suffix}";
    }

    private function storeAttachments(Request $request, $animal): void
    {
        if (!$request->hasFile('attachment_files')) {
            return;
        }

        foreach ((array) $request->file('attachment_files') as $file) {
            if (!$file || !$file->isValid()) {
                continue;
            }

            $storedPath = $file->store('animal-attachments/' . (string) $animal->id, 'public');

            AnimalAttachment::create([
                'user_id' => (string) ($animal->user_id ?? $request->user()?->id ?? ''),
                'animal_id' => (string) $animal->id,
                'file_path' => Storage::disk('public')->url($storedPath),
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
            ]);
        }
    }
}
