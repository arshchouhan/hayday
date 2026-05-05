<?php

namespace App\Http\Controllers;

use App\Models\FarmNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userId = (string) $request->user()->getKey();
        $limit = min(max((int) $request->query('limit', 25), 1), 100);
        $status = $request->query('status');
        $category = $request->query('category');

        $query = FarmNotification::where('user_id', $userId);

        if ($status && in_array($status, ['unread', 'read', 'resolved'], true)) {
            $query->where('status', $status);
        }

        if ($category && in_array($category, ['activity', 'attention'], true)) {
            $query->where('category', $category);
        }

        $notifications = $query
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $totalCount = FarmNotification::where('user_id', $userId)->count();
        $unreadCount = FarmNotification::where('user_id', $userId)->where('status', 'unread')->count();
        $attentionCount = FarmNotification::where('user_id', $userId)->where('category', 'attention')->whereIn('status', ['unread', 'read'])->count();

        return response()->json([
            'success' => true,
            'data' => $notifications->map(fn (FarmNotification $notification) => $this->formatNotification($notification))->values(),
            'meta' => [
                'total_count' => $totalCount,
                'unread_count' => $unreadCount,
                'attention_count' => $attentionCount,
                'limit' => $limit,
            ],
        ]);
    }

    public function markRead(Request $request, $id)
    {
        $notification = FarmNotification::where('_id', $id)
            ->where('user_id', (string) $request->user()->getKey())
            ->first();

        if (! $notification) {
            return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
        }

        $notification->update([
            'status' => 'read',
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->formatNotification($notification->fresh()),
        ]);
    }

    public function markAllRead(Request $request)
    {
        $userId = (string) $request->user()->getKey();

        FarmNotification::where('user_id', $userId)
            ->where('status', 'unread')
            ->update([
                'status' => 'read',
                'read_at' => now(),
            ]);

        return response()->json(['success' => true, 'message' => 'Notifications marked as read']);
    }

    public function destroy(Request $request, $id)
    {
        $notification = FarmNotification::where('_id', $id)
            ->where('user_id', (string) $request->user()->getKey())
            ->first();

        if (! $notification) {
            return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
        }

        $notification->delete();

        return response()->json(['success' => true, 'message' => 'Notification deleted']);
    }

    private function formatNotification(FarmNotification $notification): array
    {
        return [
            'id' => (string) $notification->getKey(),
            'user_id' => (string) $notification->user_id,
            'animal_id' => $notification->animal_id ? (string) $notification->animal_id : null,
            'category' => $notification->category,
            'level' => $notification->level,
            'title' => $notification->title,
            'message' => $notification->message,
            'action_url' => $notification->action_url,
            'metadata' => $notification->metadata ?? [],
            'status' => $notification->status,
            'created_at' => optional($notification->created_at)->toDateTimeString(),
            'read_at' => optional($notification->read_at)->toDateTimeString(),
            'resolved_at' => optional($notification->resolved_at)->toDateTimeString(),
        ];
    }
}
