import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { user } = useAuth();
    const [pendingRequests, setPendingRequests] = useState(0);

    const fetchStats = useCallback(async () => {
        if (!user) return;
        try {
            const response = await api.get('project-requests/stats/');
            setPendingRequests(response.data.pending_count);
        } catch (err) {
            console.error("Failed to fetch admin stats", err);
        }
    }, [user]);

    useEffect(() => {
        fetchStats();
        // Poll every 1 minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    return (
        <AdminContext.Provider value={{ pendingRequests, refreshStats: fetchStats }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
