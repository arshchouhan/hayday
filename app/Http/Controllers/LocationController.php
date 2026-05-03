<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }
        return response()->json(Location::where('user_id', $userId)->get());
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }
        $data['user_id'] = $userId;
        
        $location = Location::create($data);
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
