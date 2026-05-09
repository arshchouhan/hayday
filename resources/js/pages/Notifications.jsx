import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { formatTimeAgo } from '../utils/notifications';

const levelStyles = {
    info: 'bg-blue-50 text-blue-700 ring-blue-100',
    warning: 'bg-amber-50 text-amber-700 ring-amber-100',
    danger: 'bg-red-50 text-red-700 ring-red-100',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

export default function Notifications() {
    const navigate = useNavigate();
    const isLocalHost = typeof window !== 'undefined' && /^(localhost|127\.)/.test(window.location.hostname);
    const isJavaNotifications = !isLocalHost;
    const {
        notifications,
        unreadCount,
        loading,
        markAllReadLoading,
        error,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
    } = useNotifications();

    useEffect(() => {
        void loadNotifications(50);
    }, [loadNotifications]);

    const attentionCount = notifications.filter((notification) => notification.category === 'attention' && notification.status !== 'resolved').length;

    const openNotification = async (notification) => {
        if (notification.status === 'unread') {
            await markAsRead(notification.id);
        }

        navigate(notification.action_url || '/farm');
    };

    return (
        <div className="relative h-full overflow-auto bg-[#F8FAFD] p-6 sm:p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-[28px] border border-[#D6E2EE] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.35em] text-[#6B7A90]">Farm notifications</p>
                            <h1 className="mt-2 text-[34px] font-black tracking-tight text-[#1a1a2e]">Alerts, activity, and animal attention</h1>
                            <p className="mt-2 max-w-2xl text-[14px] font-medium leading-relaxed text-gray-500">
                                Every activity on the farm creates a notification, and animals that need attention stay visible until the issue is resolved.
                            </p>
                            {isJavaNotifications && (
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D6E2EE] bg-[#F8FAFD] px-3 py-1.5 text-[12px] font-bold text-[#1a1a2e]">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    </span>
                                    Powered by Maven notifications
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => void loadNotifications(50)}
                                className="rounded-full border border-gray-200 bg-white px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                            >
                                Refresh
                            </button>
                            <button
                                type="button"
                                onClick={() => { void markAllAsRead(); }}
                                disabled={markAllReadLoading}
                                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a2e] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#233746] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {markAllReadLoading && (
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                    </svg>
                                )}
                                {markAllReadLoading ? 'Marking all read...' : 'Mark all read'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-[#E9EEF6] p-4">
                            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-gray-500">Unread</p>
                            <p className="mt-2 text-[28px] font-black text-[#1a1a2e]">{unreadCount}</p>
                        </div>
                        <div className="rounded-2xl bg-[#FEF3C7] p-4">
                            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-amber-700">Attention</p>
                            <p className="mt-2 text-[28px] font-black text-[#1a1a2e]">{attentionCount}</p>
                        </div>
                        <div className="rounded-2xl bg-[#DCFCE7] p-4">
                            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-emerald-700">Total</p>
                            <p className="mt-2 text-[28px] font-black text-[#1a1a2e]">{notifications.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-[#D6E2EE] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#D6E2EE] px-6 py-4">
                        <div>
                            <h2 className="text-[18px] font-black text-[#1a1a2e]">Latest feed</h2>
                            <p className="text-[13px] font-medium text-gray-500">Open notifications first, resolved items below them.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => void loadNotifications(50)}
                            className="rounded-full border border-gray-200 px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Sync
                        </button>
                    </div>

                    <div className="divide-y divide-[#EEF2F7]">
                        {loading && notifications.length === 0 ? (
                            <div className="px-6 py-10 text-center text-[14px] font-medium text-gray-500">
                                {isJavaNotifications ? 'Waiting for Maven service...' : 'Loading notifications...'}
                            </div>
                        ) : isJavaNotifications && error ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-[16px] font-black text-[#1a1a2e]">Maven service is warming up</p>
                                <p className="mt-2 text-[13px] font-medium text-gray-500">
                                    Notifications will appear once the deployed Java service responds.
                                </p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-[16px] font-black text-[#1a1a2e]">No notifications yet</p>
                                <p className="mt-2 text-[13px] font-medium text-gray-500">Activity and attention alerts will appear here automatically.</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
                                    <button
                                        type="button"
                                        onClick={() => void openNotification(notification)}
                                        className="flex flex-1 items-start gap-4 text-left"
                                    >
                                        <div className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${levelStyles[notification.level] || levelStyles.info}`}>
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                                {notification.category === 'attention' ? (
                                                    <>
                                                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                        <path d="M12 9v4" />
                                                        <path d="M12 17h.01" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <path d="M22 12A10 10 0 1 1 12 2" />
                                                        <path d="M22 2 12 12" />
                                                    </>
                                                )}
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-[15px] font-black text-[#1a1a2e]">{notification.title}</h3>
                                                <span className="rounded-full bg-[#E9EEF6] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                                    {notification.category}
                                                </span>
                                                <span className="text-[11px] font-semibold text-gray-400">{formatTimeAgo(notification.created_at)}</span>
                                            </div>
                                            <p className="mt-2 text-[13px] font-medium leading-relaxed text-gray-600">{notification.message}</p>
                                        </div>
                                    </button>

                                    <div className="flex items-center gap-2 self-start md:self-center">
                                        {notification.status === 'unread' && (
                                            <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                                                New
                                            </span>
                                        )}
                                        {notification.status === 'resolved' && (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                                Resolved
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await removeNotification(notification.id);
                                            }}
                                            className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                            aria-label="Delete notification"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18" />
                                                <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                                                <path d="M10 11v6" />
                                                <path d="M14 11v6" />
                                                <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
