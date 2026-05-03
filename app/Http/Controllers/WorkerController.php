<?php

namespace App\Http\Controllers;

use App\Models\Worker;
use App\Mail\WorkerWelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class WorkerController extends Controller
{
    public function index()
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }
        return Worker::where('user_id', $userId)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'animal_id' => 'nullable|string',
            'group_id' => 'nullable|string',
            'task' => 'nullable|string',
            'cost' => 'nullable|string',
        ]);

        $validated['status'] = 'Signed Up'; // Default status
        
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }
        $validated['user_id'] = $userId;

        $worker = Worker::create($validated);

        // Send welcome email
        try {
            Mail::to($worker->email)->send(new WorkerWelcomeMail($worker));
        } catch (\Exception $e) {
            \Log::error("Failed to send welcome email to worker: " . $e->getMessage());
        }

        return response()->json($worker, 201);
    }

    public function show($id)
    {
        return Worker::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $worker = Worker::findOrFail($id);
        $worker->update($request->all());
        return $worker;
    }

    public function destroy($id)
    {
        $worker = Worker::findOrFail($id);
        $worker->delete();
        return response()->json(null, 204);
    }
}
