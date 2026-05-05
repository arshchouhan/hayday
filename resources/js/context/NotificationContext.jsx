import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

    const loadNotifications = useCallback(async (limit = DEFAULT_LIMIT) => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/notifications', {
                params: { limit },
            });

            setNotifications(response.data?.data ?? []);
            setUnreadCount(response.data?.meta?.unread_count ?? 0);
        } catch (err) {
            setError(err);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        void loadNotifications();
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
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
