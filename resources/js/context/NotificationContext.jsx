import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const DEFAULT_LIMIT = 25;

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const lastNotifiedIdRef = useRef(null);

    const loadNotifications = useCallback(async (limit = DEFAULT_LIMIT, silent = false) => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setError(null);
            return;
        }

        if (!silent) setLoading(true);
        setError(null);

        try {
            const response = await api.get('/notifications', {
                params: { limit },
            });

            const newNotifications = response.data?.data ?? [];
            const newUnreadCount = response.data?.meta?.unread_count ?? 0;

            // Detect new notification for toast (only if polling silently)
            if (silent && newNotifications.length > 0) {
                const latest = newNotifications[0];
                const createdAt = new Date(latest.created_at).getTime();
                const isFresh = (Date.now() - createdAt) < 20000; // Only toast if created in last 20s

                if (lastNotifiedIdRef.current && latest.id !== lastNotifiedIdRef.current && latest.status === 'unread' && isFresh) {
                    showToast(latest.title, latest.message);
                }
                lastNotifiedIdRef.current = latest.id;
            } else if (!silent && newNotifications.length > 0) {
                lastNotifiedIdRef.current = newNotifications[0].id;
            }

            setNotifications(newNotifications);
            setUnreadCount(newUnreadCount);
        } catch (err) {
            setError(err);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [user]);

    const showToast = (title, message) => {
        setToast({ title, message });
        setTimeout(() => setToast(null), 5000);
    };

    useEffect(() => {
        loadNotifications();
        
        const pollInterval = setInterval(() => {
            loadNotifications(DEFAULT_LIMIT, true);
        }, 10000); // Poll every 10 seconds for real-time feel

        return () => clearInterval(pollInterval);
    }, [loadNotifications]);

    const markAsRead = useCallback(async (id) => {
        await api.patch(`/notifications/${id}/read`);
        await loadNotifications();
    }, [loadNotifications]);

    const markAllAsRead = useCallback(async () => {
        await api.patch('/notifications/read-all');
        await loadNotifications();
    }, [loadNotifications]);

    const removeNotification = useCallback(async (id) => {
        await api.delete(`/notifications/${id}`);
        await loadNotifications();
    }, [loadNotifications]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                error,
                loadNotifications,
                markAsRead,
                markAllAsRead,
                removeNotification,
            }}
        >
            {children}
            
            {/* Real-time Notification Toast */}
            {toast && (
                <div className="fixed right-6 top-6 z-[200] w-80 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl ring-1 ring-black/5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EEF6] text-[#1a1a2e]">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[14px] font-black text-[#1a1a2e]">{toast.title}</p>
                                <p className="mt-1 text-[12px] font-medium text-gray-500 line-clamp-2">{toast.message}</p>
                            </div>
                            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="mt-3 h-1 w-full bg-gray-50">
                            <div className="h-full bg-[#1a1a2e] animate-progress" style={{ animationDuration: '5s' }} />
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
