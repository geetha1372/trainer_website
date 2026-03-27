import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import api from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('No user ID');
      const response = await api.get(`/api/profile/${userId}/`);
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/login/', { email, password });
    const { access, refresh, user } = response.data;
    localStorage.setItem('auth_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_id', user.id.toString());
    setUser(user);
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    const response = await api.post('/api/register/', {
      full_name: name,
      email,
      password,
      confirm_password: confirmPassword,
    });
    const { access, refresh, user_id } = response.data;
    if (access) localStorage.setItem('auth_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    if (user_id) localStorage.setItem('user_id', user_id.toString());
    // Signup might not return the full user object, so we might need a separate profile fetch
    if (user_id) {
       const profileRes = await api.get(`/api/profile/${user_id}/`);
       setUser(profileRes.data);
    }
  };

  const logout = async () => {
    try {
      // await api.post('/api/auth/logout'); // Django might not have this, usually client-side clear is enough
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
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
