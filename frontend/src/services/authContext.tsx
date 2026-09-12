import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, UserProfile } from './api';

interface AuthContextType {
  token: string | null;
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (token: string, user: { id: string; email: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshDashboard: () => void;
  dashboardRefreshTrigger: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hearth_access_token'));
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const saved = localStorage.getItem('hearth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('hearth_theme');
    return (savedTheme as 'dark' | 'light') || 'dark';
  });
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('hearth_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (newToken: string, newUser: { id: string; email: string }) => {
    localStorage.setItem('hearth_access_token', newToken);
    localStorage.setItem('hearth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('hearth_access_token');
    localStorage.removeItem('hearth_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshDashboard = () => {
    setDashboardRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        theme,
        toggleTheme,
        login,
        logout,
        isAuthenticated: !!token,
        refreshDashboard,
        dashboardRefreshTrigger,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
