<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private readonly NotificationService $notificationService)
    {
    }

    public function index(Request $request)
    {
        $userId = (string) $request->user()->getKey();
        $payload = $this->notificationService->list($userId);

        return response()->json($payload);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => ['required', 'string'],
            'level' => ['required', 'string'],
            'title' => ['required', 'string'],
            'message' => ['required', 'string'],
            'action_url' => ['nullable', 'string'],
            'animal_id' => ['nullable', 'string'],
            'dedup_key' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ]);

        $data['user_id'] = (string) $request->user()->getKey();
        $notification = $this->notificationService->create($data);

        return response()->json([
            'success' => true,
            'data' => $notification,
        ], 201);
    }

    public function markRead(Request $request, $id)
    {
        try {
            $notification = $this->notificationService->markRead($id);

            return response()->json([
                'success' => true,
                'data' => $notification,
            ]);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 404);
        }
    }

    public function markAllRead(Request $request)
    {
        $userId = (string) $request->user()->getKey();

        $this->notificationService->markAllRead($userId);

        return response()->json(['success' => true, 'message' => 'Notifications marked as read']);
    }

    public function destroy(Request $request, $id)
    {
        try {
            $this->notificationService->delete($id);

            return response()->json(['success' => true, 'message' => 'Notification deleted']);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 404);
        }
    }
}
