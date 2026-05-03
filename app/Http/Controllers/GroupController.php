<?php

namespace App\Http\Controllers;

use App\Models\Group;
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
        return $group;
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();
        return response()->json(null, 204);
    }
}
