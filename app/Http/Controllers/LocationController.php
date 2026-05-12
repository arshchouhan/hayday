<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(Location::all());
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $data['user_id'] = $userId;
        
        $location = Location::create($data);

        app(NotificationService::class)->logActivityCreated($request->user(), 'location', $location->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/location',
            'metadata' => [
                'event' => 'location_created',
                'location_id' => (string) $location->getKey(),
            ],
        ]);

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

        app(NotificationService::class)->logActivityUpdated($request->user(), 'location', $location->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/location',
            'metadata' => [
                'event' => 'location_updated',
                'location_id' => (string) $location->getKey(),
            ],
        ]);

        return response()->json($location);
    }

    public function destroy($id)
    {
        $location = Location::find($id);
        if (!$location) return response()->json(['message' => 'Location not found'], 404);
        $locationName = $location->name;
        $location->delete();

        app(NotificationService::class)->logActivityDeleted(request()->user(), 'location', $locationName, [
            'category' => 'activity',
            'level' => 'warning',
            'action_url' => '/farm/location',
            'metadata' => [
                'event' => 'location_deleted',
                'location_id' => (string) $id,
            ],
        ]);

        return response()->json(['success' => true]);
    }
}
