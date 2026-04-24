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
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Determine which model to use based on species
        $species = strtolower($request->input('species'));
        $modelClass = Animal::class;

        if ($species === 'sheep') {
            $modelClass = Sheep::class;
        } elseif ($species === 'cow' || $species === 'cattle') {
            $modelClass = Cattle::class;
        }

        $animal = $modelClass::create($request->all());

        return response()->json([
            'success' => true,
            'message' => ucfirst($species) . ' registered successfully',
            'data' => $animal
        ], 201);
    }

    public function getFormData()
    {
        return response()->json([
            'breeds' => Breed::all(),
            'locations' => Location::all(),
            'groups' => Group::all(),
            // For now, return all bulls/cows as sires/dams, but you can filter by species later if needed
            'sires' => Animal::whereIn('type', ['bull', 'ram'])->get(['id', 'ear_tag', 'animal_name']),
            'dams' => Animal::whereIn('type', ['cow', 'ewe'])->get(['id', 'ear_tag', 'animal_name']),
        ]);
    }
}
