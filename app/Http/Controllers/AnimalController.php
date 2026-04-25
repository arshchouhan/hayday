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

class AnimalController extends Controller
{
    public function index()
    {
        // Fetch animals from the default 'animals' collection
        $animals = Animal::with(['breed', 'location', 'group'])->get();
        // Also fetch cattle from the dedicated 'cattle' collection (Cattle model)
        $cattle = Cattle::with(['breed', 'location', 'group'])->get();
        // Also fetch sheep from the dedicated 'sheeps' collection (Sheep model)
        $sheep = Sheep::with(['breed', 'location', 'group'])->get();
        // Merge all collections into a single list
        $combined = $animals->merge($cattle)->merge($sheep);
        return response()->json($combined);
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
        $sires = Animal::whereIn('type', ['bull', 'ram'])->get(['id', 'ear_tag', 'animal_name'])
            ->merge(Cattle::whereIn('type', ['bull', 'ram'])->get(['id', 'ear_tag', 'animal_name']))
            ->merge(Sheep::whereIn('type', ['bull', 'ram'])->get(['id', 'ear_tag', 'animal_name']));
            
        $dams = Animal::whereIn('type', ['cow', 'ewe'])->get(['id', 'ear_tag', 'animal_name'])
            ->merge(Cattle::whereIn('type', ['cow', 'ewe'])->get(['id', 'ear_tag', 'animal_name']))
            ->merge(Sheep::whereIn('type', ['cow', 'ewe'])->get(['id', 'ear_tag', 'animal_name']));

        return response()->json([
            'breeds' => Breed::all(),
            'locations' => Location::all(),
            'groups' => Group::all(),
            'sires' => $sires,
            'dams' => $dams,
        ]);
    }
}
