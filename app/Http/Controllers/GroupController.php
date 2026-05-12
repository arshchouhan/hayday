<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {

        $groups = Group::all();
        return $groups->map(function ($group) {
            $group->animals_count = $group->animals()->count();
            return $group;
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $validated['user_id'] = $userId;

        $group = Group::create($validated);

        app(NotificationService::class)->logActivityCreated($request->user(), 'group', $group->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/groups',
            'metadata' => [
                'event' => 'group_created',
                'group_id' => (string) $group->getKey(),
            ],
        ]);

        return response()->json($group, 201);
    }

    public function show($id)
    {
        return Group::with('animals')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);
        $group->update($request->all());

        app(NotificationService::class)->logActivityUpdated($request->user(), 'group', $group->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/groups',
            'metadata' => [
                'event' => 'group_updated',
                'group_id' => (string) $group->getKey(),
            ],
        ]);

        return $group;
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $groupName = $group->name;
        $group->delete();

        app(NotificationService::class)->logActivityDeleted(request()->user(), 'group', $groupName, [
            'category' => 'activity',
            'level' => 'warning',
            'action_url' => '/farm/groups',
            'metadata' => [
                'event' => 'group_deleted',
                'group_id' => (string) $id,
            ],
        ]);

        return response()->json(null, 204);
    }
}
