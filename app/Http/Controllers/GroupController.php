<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }

        $groups = Group::where('user_id', $userId)->get();
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
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
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
