'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'oidc-client-ts';
import { getUser, login, logout, isAuthenticated, getUserManager } from '@/lib/oidc';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkAuth = async () => {
    if (!isClient) return;
    
    try {
      setIsLoading(true);
      const currentUser = await getUser();
      const authStatus = await isAuthenticated();
      
      setUser(currentUser);
      setAuthenticated(authStatus);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!isClient) return;
    
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    if (!isClient) return;
    
    try {
      await logout();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    // Initialize auth check
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up event listeners for user changes
    const userManager = getUserManager();
    if (!userManager) {
      console.warn('UserManager not available - possibly running on server side');
      setIsLoading(false);
      return;
    }
    
    const handleUserLoaded = (user: User) => {
      console.log('User loaded:', user.profile?.preferred_username || user.profile?.email);
      setUser(user);
      setAuthenticated(true);
      setIsLoading(false);
    };

    const handleUserUnloaded = () => {
      console.log('User unloaded');
      setUser(null);
      setAuthenticated(false);
      setIsLoading(false);
    };

    const handleAccessTokenExpired = () => {
      console.log('Access token expired');
      setUser(null);
      setAuthenticated(false);
    };

    const handleSilentRenewError = (error: Error) => {
      console.error('Silent token renewal failed:', error);
    };

    try {
      userManager.events.addUserLoaded(handleUserLoaded);
      userManager.events.addUserUnloaded(handleUserUnloaded);
      userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
      userManager.events.addSilentRenewError(handleSilentRenewError);

      return () => {
        userManager.events.removeUserLoaded(handleUserLoaded);
        userManager.events.removeUserUnloaded(handleUserUnloaded);
        userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
        userManager.events.removeSilentRenewError(handleSilentRenewError);
      };
    } catch (error) {
      console.error('Failed to set up user manager event listeners:', error);
      setIsLoading(false);
    }
  }, [isClient]);

  // Always provide the context, with appropriate values for server/client
  const value: AuthContextType = {
    user,
    isLoading: !isClient || isLoading, // Loading if on server or client is loading
    isAuthenticated: isClient && authenticated, // Only authenticated on client
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
