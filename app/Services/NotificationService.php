<?php

namespace App\Services;

use App\Models\Animal;
use App\Models\FarmNotification;
use App\Models\HealthRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    private string $driver;
    private string $javaUrl;

    public function __construct()
    {
        $this->driver = (string) config('services.notifications.driver', 'laravel');
        $this->javaUrl = rtrim((string) config('services.notifications.java_url', 'http://localhost:8080'), '/');

        Log::info('NotificationService initialized', [
            'driver' => $this->driver,
            'java_url' => $this->javaUrl,
        ]);
    }

    public function list($userId)
    {
        return $this->driver === 'java'
            ? $this->listFromJava($userId)
            : $this->listFromLaravel($userId);
    }

    public function create(array $data)
    {
        return $this->driver === 'java'
            ? $this->createViaJava($data)
            : $this->createViaLaravel($data);
    }

    public function markRead($notificationId)
    {
        return $this->driver === 'java'
            ? $this->markReadJava($notificationId)
            : $this->markReadLaravel($notificationId);
    }

    public function markAllRead($userId)
    {
        return $this->driver === 'java'
            ? $this->markAllReadJava($userId)
            : $this->markAllReadLaravel($userId);
    }

    public function delete($notificationId)
    {
        return $this->driver === 'java'
            ? $this->deleteJava($notificationId)
            : $this->deleteLaravel($notificationId);
    }

    public function logActivityAlert(array $data, ?User $user = null)
    {
        $userId = $this->resolveUserId($user);

        if (! $userId) {
            return null;
        }

        $payload = array_merge([
            'user_id' => $userId,
            'category' => 'activity',
            'level' => 'info',
            'title' => 'Activity logged',
            'message' => 'An activity was recorded.',
            'action_url' => null,
            'animal_id' => null,
            'metadata' => [],
            'dedup_key' => null,
        ], $data);

        return $this->driver === 'java'
            ? $this->createViaJava($payload)
            : FarmNotification::create([
                'user_id' => (string) $payload['user_id'],
                'animal_id' => $payload['animal_id'] !== null ? (string) $payload['animal_id'] : null,
                'category' => $payload['category'],
                'level' => $payload['level'],
                'title' => $payload['title'],
                'message' => $payload['message'],
                'action_url' => $payload['action_url'],
                'metadata' => $payload['metadata'],
                'status' => 'unread',
                'read_at' => null,
                'resolved_at' => null,
                'dedup_key' => $payload['dedup_key'],
            ]);
    }

    public function logActivityCreated(?User $user, string $subject, string $label = '', array $data = [])
    {
        return $this->logActivityAlert(array_merge([
            'title' => ucfirst($subject) . ' created',
            'message' => $this->buildActivityMessage($subject, 'created', $label),
        ], $data), $user);
    }

    public function logActivityUpdated(?User $user, string $subject, string $label = '', array $data = [])
    {
        return $this->logActivityAlert(array_merge([
            'title' => ucfirst($subject) . ' updated',
            'message' => $this->buildActivityMessage($subject, 'updated', $label),
        ], $data), $user);
    }

    public function logActivityDeleted(?User $user, string $subject, string $label = '', array $data = [])
    {
        return $this->logActivityAlert(array_merge([
            'level' => 'warning',
            'title' => ucfirst($subject) . ' deleted',
            'message' => $this->buildActivityMessage($subject, 'deleted', $label),
        ], $data), $user);
    }

    public function logActivityRecorded(?User $user, string $subject, string $label = '', array $data = [])
    {
        return $this->logActivityAlert(array_merge([
            'title' => ucfirst($subject) . ' recorded',
            'message' => $this->buildActivityMessage($subject, 'recorded', $label),
        ], $data), $user);
    }

    public function createActivityNotification(?User $user, Animal $animal, array $data): ?FarmNotification
    {
        $userId = $this->resolveUserId($user);

        if (! $userId) {
            return null;
        }

        if ($this->driver === 'java') {
            $payload = [
                'user_id' => $userId,
                'animal_id' => (string) $animal->getKey(),
                'category' => $data['category'] ?? 'activity',
                'level' => $data['level'] ?? 'info',
                'title' => $data['title'],
                'message' => $data['message'],
                'action_url' => $data['action_url'] ?? null,
                'metadata' => $data['metadata'] ?? [],
                'dedup_key' => $data['dedup_key'] ?? null,
            ];

            $this->createViaJava($payload);

            return null;
        }

        return FarmNotification::create([
            'user_id' => $userId,
            'animal_id' => (string) $animal->getKey(),
            'category' => $data['category'] ?? 'activity',
            'level' => $data['level'] ?? 'info',
            'title' => $data['title'],
            'message' => $data['message'],
            'action_url' => $data['action_url'] ?? null,
            'metadata' => $data['metadata'] ?? [],
            'status' => 'unread',
            'read_at' => null,
            'resolved_at' => null,
            'dedup_key' => $data['dedup_key'] ?? null,
        ]);
    }

    /**
     * Keep a single open notification per animal issue, and resolve it when the issue disappears.
     *
     * @return array<int, FarmNotification>
     */
    public function syncAnimalAttentionNotifications(?User $user, Animal $animal): array
    {
        $userId = $this->resolveUserId($user);

        if (! $userId) {
            return [];
        }

        if ($this->driver === 'java') {
            $issues = $this->buildAttentionIssues($animal);

            return array_map(function (array $issue) use ($userId, $animal) {
                return $this->createViaJava([
                    'user_id' => $userId,
                    'animal_id' => (string) $animal->getKey(),
                    'category' => 'attention',
                    'level' => $issue['level'],
                    'title' => $issue['title'],
                    'message' => $issue['message'],
                    'action_url' => $issue['action_url'] ?? null,
                    'metadata' => $issue['metadata'] ?? [],
                    'dedup_key' => $issue['dedup_key'] ?? null,
                ]);
            }, $issues);
        }

        $issues = $this->buildAttentionIssues($animal);
        $activeKeys = collect($issues)->pluck('dedup_key')->filter()->values()->all();
        $saved = [];

        foreach ($issues as $issue) {
            $notification = FarmNotification::firstOrNew([
                'user_id' => $userId,
                'animal_id' => (string) $animal->getKey(),
                'category' => 'attention',
                'dedup_key' => $issue['dedup_key'],
            ]);

            $preserveStatus = $notification->exists && $notification->status === 'read' ? 'read' : 'unread';

            $notification->fill([
                'level' => $issue['level'],
                'title' => $issue['title'],
                'message' => $issue['message'],
                'action_url' => $issue['action_url'] ?? null,
                'metadata' => $issue['metadata'] ?? [],
                'status' => $preserveStatus,
                'read_at' => $preserveStatus === 'read' ? $notification->read_at : null,
                'resolved_at' => null,
            ]);

            $notification->save();
            $saved[] = $notification;
        }

        FarmNotification::where('user_id', $userId)
            ->where('animal_id', (string) $animal->getKey())
            ->where('category', 'attention')
            ->where('status', '!=', 'resolved')
            ->when(! empty($activeKeys), function ($query) use ($activeKeys) {
                $query->whereNotIn('dedup_key', $activeKeys);
            }, function ($query) {
                $query->whereNotNull('dedup_key');
            })
            ->update([
                'status' => 'resolved',
                'resolved_at' => now(),
            ]);

        return $saved;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function buildAttentionIssues(Animal $animal): array
    {
        $issues = [];
        $animalLabel = $this->animalLabel($animal);
        $detailsUrl = '/farm/details/' . $animal->getKey();

        if (blank($animal->ear_tag) && blank($animal->animal_name)) {
            $issues[] = $this->issue(
                'missing-animal-label',
                'Animal needs an identity label',
                "{$animalLabel} does not have a visible ear tag or name yet.",
                'warning',
                $detailsUrl,
                ['reason' => 'missing_label']
            );
        }

        if (blank($animal->location_id)) {
            $issues[] = $this->issue(
                'missing-location',
                'Animal location needs attention',
                "{$animalLabel} has no assigned location.",
                'warning',
                $detailsUrl,
                ['reason' => 'missing_location']
            );
        }

        if (blank($animal->group_id)) {
            $issues[] = $this->issue(
                'missing-group',
                'Animal group needs attention',
                "{$animalLabel} has not been assigned to a group.",
                'warning',
                $detailsUrl,
                ['reason' => 'missing_group']
            );
        }

        if (strtolower((string) $animal->status) === 'dead') {
            $issues[] = $this->issue(
                'status-dead',
                'Animal marked as dead',
                "{$animalLabel} is marked as dead and should stay in the attention feed until the record is reviewed.",
                'danger',
                $detailsUrl,
                ['reason' => 'status_dead']
            );
        }

        $sex = strtolower((string) $animal->sex);
        if (in_array($sex, ['female', 'cow', 'heifer', 'ewe'], true) && blank($animal->breeding_status)) {
            $issues[] = $this->issue(
                'breeding-status',
                'Breeding status needs review',
                "{$animalLabel} does not have a breeding status yet.",
                'info',
                $detailsUrl,
                ['reason' => 'missing_breeding_status']
            );
        }

        $latestHealth = HealthRecord::where('animal_id', (string) $animal->getKey())
            ->orderBy('treatment_date', 'desc')
            ->first();

        if (! $latestHealth) {
            $issues[] = $this->issue(
                'health-review',
                'Health review due',
                "{$animalLabel} has no recorded health check yet.",
                'warning',
                '/farm/activity/health/' . $animal->getKey(),
                ['reason' => 'no_health_record']
            );
        } else {
            $lastDate = Carbon::parse($latestHealth->treatment_date);
            if ($lastDate->lt(now()->subDays(180))) {
                $issues[] = $this->issue(
                    'health-review',
                    'Health review due',
                    "{$animalLabel} last had a health update on {$lastDate->format('M d, Y')}.",
                    'warning',
                    '/farm/activity/health/' . $animal->getKey(),
                    [
                        'reason' => 'health_overdue',
                        'last_health_date' => $lastDate->toDateString(),
                    ]
                );
            }
        }

        return $issues;
    }

    private function issue(string $key, string $title, string $message, string $level, ?string $actionUrl, array $metadata): array
    {
        return [
            'dedup_key' => $key,
            'title' => $title,
            'message' => $message,
            'level' => $level,
            'action_url' => $actionUrl,
            'metadata' => $metadata,
        ];
    }

    private function animalLabel(Animal $animal): string
    {
        return $animal->ear_tag ?: $animal->animal_name ?: 'Animal ' . $animal->getKey();
    }

    private function resolveUserId(?User $user): ?string
    {
        if ($user) {
            return (string) $user->getKey();
        }

        $authUser = Auth::user();

        return $authUser ? (string) $authUser->getKey() : null;
    }

    private function listFromJava($userId)
    {
        try {
            $response = Http::acceptJson()->timeout(10)->get("{$this->javaUrl}/api/notifications/{$userId}");
            $response->throw();

            Log::info('NotificationService:listFromJava succeeded', ['user_id' => $userId]);

            return $response->json();
        } catch (ConnectionException $exception) {
            Log::error('NotificationService:listFromJava connection error', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Notification service unavailable: ' . $exception->getMessage(), previous: $exception);
        } catch (\Throwable $exception) {
            Log::error('NotificationService:listFromJava failed', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Failed to list notifications: ' . $exception->getMessage(), previous: $exception);
        }
    }

    private function createViaJava(array $data)
    {
        try {
            $payload = [
                'user_id' => $data['user_id'] ?? auth()->id(),
                'category' => $data['category'] ?? 'activity',
                'level' => $data['level'] ?? 'info',
                'title' => $data['title'] ?? '',
                'message' => $data['message'] ?? '',
                'action_url' => $data['action_url'] ?? null,
                'animal_id' => $data['animal_id'] ?? null,
                'dedup_key' => $data['dedup_key'] ?? null,
                'metadata' => $data['metadata'] ?? null,
            ];

            $response = Http::acceptJson()->timeout(10)->post("{$this->javaUrl}/api/notifications", $payload);
            $response->throw();

            Log::info('NotificationService:createViaJava succeeded', ['user_id' => $payload['user_id']]);

            return $response->json();
        } catch (ConnectionException $exception) {
            Log::error('NotificationService:createViaJava connection error', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Notification service unavailable: ' . $exception->getMessage(), previous: $exception);
        } catch (\Throwable $exception) {
            Log::error('NotificationService:createViaJava failed', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Failed to create notification: ' . $exception->getMessage(), previous: $exception);
        }
    }

    private function markReadJava($notificationId)
    {
        try {
            $response = Http::acceptJson()->timeout(10)->patch("{$this->javaUrl}/api/notifications/{$notificationId}/read");
            $response->throw();

            Log::info('NotificationService:markReadJava succeeded', ['notification_id' => $notificationId]);

            return $response->json();
        } catch (\Throwable $exception) {
            Log::error('NotificationService:markReadJava failed', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Failed to mark as read: ' . $exception->getMessage(), previous: $exception);
        }
    }

    private function markAllReadJava($userId)
    {
        try {
            $response = Http::acceptJson()->timeout(10)->patch("{$this->javaUrl}/api/notifications/{$userId}/read-all");
            $response->throw();

            Log::info('NotificationService:markAllReadJava succeeded', ['user_id' => $userId]);

            return true;
        } catch (\Throwable $exception) {
            Log::error('NotificationService:markAllReadJava failed', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Failed to mark all as read: ' . $exception->getMessage(), previous: $exception);
        }
    }

    private function deleteJava($notificationId)
    {
        try {
            $response = Http::acceptJson()->timeout(10)->delete("{$this->javaUrl}/api/notifications/{$notificationId}");
            $response->throw();

            Log::info('NotificationService:deleteJava succeeded', ['notification_id' => $notificationId]);

            return true;
        } catch (\Throwable $exception) {
            Log::error('NotificationService:deleteJava failed', ['error' => $exception->getMessage()]);
            throw new \RuntimeException('Failed to delete notification: ' . $exception->getMessage(), previous: $exception);
        }
    }

    private function listFromLaravel($userId)
    {
        $query = FarmNotification::where('user_id', (string) $userId);

        return [
            'success' => true,
            'data' => $query->orderBy('created_at', 'desc')->limit(100)->get()->map(function (FarmNotification $notification) {
                return $this->formatNotification($notification);
            })->values(),
            'meta' => [
                'total_count' => FarmNotification::where('user_id', (string) $userId)->count(),
                'unread_count' => FarmNotification::where('user_id', (string) $userId)->where('status', 'unread')->count(),
            ],
        ];
    }

    private function createViaLaravel(array $data)
    {
        $userId = (string) ($data['user_id'] ?? auth()->id());

        return FarmNotification::create([
            'user_id' => $userId,
            'animal_id' => isset($data['animal_id']) ? (string) $data['animal_id'] : null,
            'category' => $data['category'] ?? 'activity',
            'level' => $data['level'] ?? 'info',
            'title' => $data['title'] ?? '',
            'message' => $data['message'] ?? '',
            'action_url' => $data['action_url'] ?? null,
            'metadata' => $data['metadata'] ?? [],
            'status' => 'unread',
            'read_at' => null,
            'resolved_at' => null,
            'dedup_key' => $data['dedup_key'] ?? null,
        ]);
    }

    private function markReadLaravel($notificationId)
    {
        $notification = FarmNotification::where('_id', $notificationId)->first();

        if (! $notification) {
            throw new \RuntimeException('Notification not found');
        }

        $notification->update([
            'status' => 'read',
            'read_at' => now(),
        ]);

        return $this->formatNotification($notification->fresh());
    }

    private function markAllReadLaravel($userId)
    {
        FarmNotification::where('user_id', (string) $userId)
            ->where('status', 'unread')
            ->update([
                'status' => 'read',
                'read_at' => now(),
            ]);

        return true;
    }

    private function deleteLaravel($notificationId)
    {
        $notification = FarmNotification::where('_id', $notificationId)->first();

        if (! $notification) {
            throw new \RuntimeException('Notification not found');
        }

        $notification->delete();

        return true;
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
            'created_at' => optional($notification->created_at)->toIso8601String(),
            'read_at' => optional($notification->read_at)->toIso8601String(),
            'resolved_at' => optional($notification->resolved_at)->toIso8601String(),
        ];
    }

    private function buildActivityMessage(string $subject, string $action, string $label = ''): string
    {
        $entity = trim($label) !== '' ? $label : ucfirst($subject);

        return match ($action) {
            'created' => "{$entity} was created.",
            'updated' => "{$entity} was updated.",
            'deleted' => "{$entity} was deleted.",
            'recorded' => "{$entity} was recorded.",
            default => "{$entity} activity was logged.",
        };
    }
}
