import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { clearDashboardCache } from '../components/ManageCattleDashboard';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('hayday_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    // If we have a saved user, don't show the full-screen "Loading HayDay..." message on refresh
    const [loading, setLoading] = useState(!localStorage.getItem('hayday_user'));

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/user');
            setUser(response.data.user);
            localStorage.setItem('hayday_user', JSON.stringify(response.data.user));
        } catch (error) {
            setUser(null);
            localStorage.removeItem('hayday_user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            // Get CSRF cookie first
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/api/auth/login', credentials);
            // Clear any cached data from a previous user session
            clearDashboardCache();
            setUser(response.data.user);
            localStorage.setItem('hayday_user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout API failed', error);
        } finally {
            // Clear module-level cache so the next user starts fresh
            clearDashboardCache();
            setUser(null);
            localStorage.removeItem('hayday_user');
        }
    };

    const register = async (data) => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/api/auth/register', data);
            // Clear any cached data from a previous user session
            clearDashboardCache();
            setUser(response.data.user);
            localStorage.setItem('hayday_user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
