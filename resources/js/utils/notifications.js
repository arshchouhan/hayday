export function parseNotificationDate(value) {
    if (!value) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value !== 'string') return null;

    const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
    const normalizedValue = hasTimezone ? value : value.replace(' ', 'T') + 'Z';
    const date = new Date(normalizedValue);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTimeAgo(value, now = Date.now()) {
    const date = parseNotificationDate(value);

    if (!date) return 'just now';

    const diffSeconds = Math.max(1, Math.floor((now - date.getTime()) / 1000));

    if (diffSeconds < 60) return `${diffSeconds}s ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return `${Math.floor(diffHours / 24)}d ago`;
}