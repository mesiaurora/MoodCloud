import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '../api/auth';
import client from '../api/client';

interface User {
    id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await auth.isAuthenticated();
            if (authenticated) {
                client.get('/me/')
                    .then(res => setUser(res.data))
                    .catch(async () => {
                        await auth.logout();
                        setUser(null);
                    });
            }
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const credentials = { username, password };
        await auth.login(credentials);
        const user = await client.get('/me/');
        setUser(user.data)
    };

    const register = async (username: string, password: string) => {
        const credentials = { username, password };
        await auth.register(credentials);
        const user = await client.get('/me/');
        setUser(user.data)
    }

    const logout = async () => {
        setUser(null);
        await auth.logout();
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};