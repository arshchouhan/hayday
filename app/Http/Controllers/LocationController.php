<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(Location::all());
    }

    public function store(Request $request)
    {
        $location = Location::create($request->all());
        return response()->json($location, 201);
    }

    public function show($id)
    {
        $location = Location::find($id);
        if (!$location) return response()->json(['message' => 'Location not found'], 404);
        return response()->json($location);
    }

    public function update(Request $request, $id)
    {
        $location = Location::find($id);
        if (!$location) return response()->json(['message' => 'Location not found'], 404);
        $location->update($request->all());
        return response()->json($location);
    }

    public function destroy($id)
    {
        $location = Location::find($id);
        if (!$location) return response()->json(['message' => 'Location not found'], 404);
        $location->delete();
        return response()->json(['success' => true]);
    }
}
