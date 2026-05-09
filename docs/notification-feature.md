# Notification Feature Guide

This document describes only the notification feature in HayDay, so the frontend can keep working even if the backend is later replaced with Java.

Local development stays on the Laravel notification implementation. Render production can switch to the Java microservice by setting `NOTIFICATIONS_SERVICE=java` and `NOTIFICATION_API_URL` in the Render environment.
If you want the UI to show the deployed-mode message, also set `VITE_NOTIFICATIONS_SERVICE=java` for the frontend build.

## Goal

The notification feature should do three things:

1. Record every important user action as a notification.
2. Create animal attention alerts when an animal needs review.
3. Expose a stable API contract that the React UI can keep using unchanged.

## Current Frontend Contract

The frontend reads notifications through `resources/js/context/NotificationContext.jsx` and expects these API routes under `/api`:

- `GET /api/notifications`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/{id}`

The UI also expects the response shape to stay stable:

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "animal_id": "string|null",
      "category": "activity|attention",
      "level": "info|warning|danger|success",
      "title": "string",
      "message": "string",
      "action_url": "/farm/...",
      "metadata": {},
      "status": "unread|read|resolved",
      "created_at": "2026-05-05 12:00:00",
      "read_at": null,
      "resolved_at": null
    }
  ],
  "meta": {
    "total_count": 0,
    "unread_count": 0,
    "attention_count": 0,
    "limit": 25
  }
}
```

If the backend keeps this contract, the React app does not need to change.

The code already defaults to Laravel when `NOTIFICATIONS_SERVICE` is not set, so localhost behavior is unchanged unless you explicitly override it in a deployment environment.

## Data Model

The current Laravel implementation stores notifications in MongoDB using the `notifications` collection.

Recommended fields:

- `user_id`: owner of the notification
- `animal_id`: optional animal reference
- `category`: `activity` or `attention`
- `level`: `info`, `warning`, `danger`, or `success`
- `title`: short heading
- `message`: full description
- `action_url`: where the UI should navigate when clicked
- `metadata`: extra context for the event
- `status`: `unread`, `read`, or `resolved`
- `read_at`: timestamp for read state
- `resolved_at`: timestamp for closed attention items
- `dedup_key`: stable key for de-duplicating recurring animal alerts

## Notification Rules

Use these rules to keep behavior predictable:

1. Every successful user action on an animal should create an `activity` notification.
2. Animal health or status issues should create `attention` notifications.
3. If an attention issue disappears, mark the old notification as `resolved` instead of deleting it.
4. Clicking a notification should mark it read and navigate to `action_url`.
5. The bell badge should show unread count only.

## Backend Flow

The current Laravel flow is:

1. A user performs an action in the farm UI.
2. A controller saves the activity record or animal update.
3. The controller calls a notification service.
4. The service writes one activity notification.
5. The service also syncs attention alerts for the same animal.
6. The React UI reloads notifications from the API.

The important control point is the notification service, not the UI.

## Frontend Flow

The React app uses one shared context:

- `NotificationContext.jsx` loads the feed from the API.
- `Navbar.jsx` shows the bell badge and dropdown preview.
- `pages/Notifications.jsx` shows the full feed.

Any backend replacement must preserve the same JSON fields so these components continue to work.

## If You Switch To Java Later

If you replace only the notification backend with Java, use Spring Boot and keep the same route contract.

Recommended Java stack:

- Spring Boot 3.x
- Spring Web
- Spring Data MongoDB
- Spring Security or session/JWT handling that matches the rest of your app

Suggested Java document model:

- `NotificationDocument` mapped to the `notifications` collection

Suggested Java service responsibilities:

- Create activity notifications
- Sync attention notifications
- Mark single notification as read
- Mark all as read
- Delete notification
- Return counts and paginated feed data

## Java API Contract

The Java service should implement the same routes and response format:

- `GET /api/notifications`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/{id}`

Recommended request/response rules:

- Accept authenticated requests only.
- Return `success`, `data`, and `meta` keys.
- Keep `id` as a string.
- Keep `status` values identical.
- Keep `action_url` relative to the frontend app.

## Minimal Java Controller Shape

```java
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    public ResponseEntity<?> listNotifications() { ... }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable String id) { ... }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllRead() { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) { ... }
}
```

## Migration Rule

If you switch from Laravel to Java for notifications, do not change the React UI first.

Change the backend implementation behind the same API contract, then verify the following:

1. Bell badge still shows unread counts.
2. Dropdown still opens and marks items read.
3. `/farm/notifications` still lists the feed.
4. Attention alerts still resolve correctly.
5. Existing activity forms still create notifications after save.

## What Must Stay Stable

The following should not change if you want a painless backend swap:

- API paths
- JSON field names
- status values
- category values
- action URL format
- authentication behavior

## What Can Change Internally

You can change these without affecting the React UI:

- Laravel controllers can become Java controllers.
- MongoDB access can move from Eloquent to Spring Data.
- notification creation logic can move into a Java service.
- scheduled attention checks can move into Java jobs.

## Practical Recommendation

For this repo, keep the notification API shape exactly as it is now and treat it as a contract.

When you rewrite the notification backend in Java, match the contract first, then swap the implementation.
