<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Models\Breed;
use App\Models\Location;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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

        // Authentication filter - no demo fallback for protected route
        $userId = \Illuminate\Support\Facades\Auth::id();
        if ($userId) {
            $matchStage['user_id'] = (string) $userId;
        }

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
        $rows = array_map(
            [$this, 'normalizeMongoDocument'],
            $this->toPhpArray($result['data'] ?? [])
        );
        $meta = $this->toPhpArray($result['meta'] ?? []);
        $summaryRows = $this->toPhpArray($result['summary'] ?? []);

        $total = $meta[0]['total'] ?? 0;
        $summary = $summaryRows[0] ?? [];

        return response()->json([
            'data' => $rows,
            'meta' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'last_page' => (int) max(1, ceil($total / $perPage)),
                'location_count' => $summary['location_count'] ?? 0,
                'group_count' => $summary['group_count'] ?? 0,
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

        // Step 2: single eager-load only on the correct model
        $animal = $modelClass::with(['breed', 'location', 'group', 'sire', 'dam'])->find($id);

        return response()->json($animal);
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
        \Illuminate\Support\Facades\Log::info('Animal saved successfully ID: ' . $animal->id);
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
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
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
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }

        $type = $request->query('type'); // male or female
        
        if ($type === 'male') {
            $types = ['bull', 'ram', 'steer'];
        } else {
            $types = ['cow', 'ewe', 'replacement_heifer'];
        }

        $results = Animal::where('user_id', $userId)->whereIn('type', $types)->get(['id', 'ear_tag', 'animal_name'])
            ->merge(Cattle::where('user_id', $userId)->whereIn('type', $types)->get(['id', 'ear_tag', 'animal_name']))
            ->merge(Sheep::where('user_id', $userId)->whereIn('type', $types)->get(['id', 'ear_tag', 'animal_name']));

        return response()->json($results);
    }

    public function update(Request $request, $id)
    {
        // Find the animal across collections
        $animal = Animal::find($id) ?? Cattle::find($id) ?? Sheep::find($id);
        if (!$animal) return response()->json(['message' => 'Animal not found'], 404);

        $animal->update($request->all());
        return response()->json(['success' => true, 'data' => $animal]);
    }
}
