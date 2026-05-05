<?php

namespace App\Services;

use App\Models\Animal;
use App\Models\FarmNotification;
use App\Models\HealthRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    public function createActivityNotification(?User $user, Animal $animal, array $data): ?FarmNotification
    {
        $userId = $this->resolveUserId($user);

        if (! $userId) {
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
}
