<?php

namespace App\Http\Controllers;

use App\Models\Worker;
use App\Mail\WorkerWelcomeMail;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class WorkerController extends Controller
{
    public function index()
    {
        return Worker::all();
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
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $validated['user_id'] = $userId;

        $worker = Worker::create($validated);

        app(NotificationService::class)->logActivityCreated($request->user(), 'worker', $worker->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/workers',
            'metadata' => [
                'event' => 'worker_created',
                'worker_id' => (string) $worker->getKey(),
            ],
        ]);

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

        app(NotificationService::class)->logActivityUpdated($request->user(), 'worker', $worker->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/workers',
            'metadata' => [
                'event' => 'worker_updated',
                'worker_id' => (string) $worker->getKey(),
            ],
        ]);

        return $worker;
    }

    public function destroy($id)
    {
        $worker = Worker::findOrFail($id);
        $workerName = $worker->name;
        $worker->delete();

        app(NotificationService::class)->logActivityDeleted(request()->user(), 'worker', $workerName, [
            'category' => 'activity',
            'level' => 'warning',
            'action_url' => '/farm/workers',
            'metadata' => [
                'event' => 'worker_deleted',
                'worker_id' => (string) $id,
            ],
        ]);

        return response()->json(null, 204);
    }
}
