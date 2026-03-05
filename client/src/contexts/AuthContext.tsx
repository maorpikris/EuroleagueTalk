import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

interface User {
    id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const userData = await getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = (userData: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const updateUser = (updatedFields: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updatedFields } : null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
