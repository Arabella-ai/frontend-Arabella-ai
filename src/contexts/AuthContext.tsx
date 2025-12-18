'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { api } from '@/lib/api';
import type { User, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (idToken: string) => Promise<AuthResponse>;
  testLogin: (email?: string, name?: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'arabella_user_data';

// Helper to load user from localStorage
function loadUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    console.log('[Auth] Loading from storage:', { hasStored: !!stored });
    if (stored) {
      const user = JSON.parse(stored);
      // Validate user has required fields
      if (user && user.id && user.email) {
        console.log('[Auth] Loaded user from storage:', { id: user.id, email: user.email, name: user.name });
        return user;
      } else {
        console.warn('[Auth] Invalid user data in storage:', user);
      }
    }
  } catch (error) {
    console.error('[Auth] Failed to load user from storage:', error);
  }
  return null;
}

// Helper to save user to localStorage
function saveUserToStorage(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      console.log('[Auth] Saved user to storage:', { id: user.id, email: user.email, name: user.name });
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      console.log('[Auth] Cleared user from storage');
    }
  } catch (error) {
    console.error('[Auth] Failed to save user to storage:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state with cached user data if available
  const [state, setState] = useState<AuthState>(() => {
    const cachedUser = loadUserFromStorage();
    const token = api.getAccessToken();
    const initialState = {
      user: cachedUser,
      isLoading: !!token && !cachedUser, // Only show loading if we have token but no cached user
      isAuthenticated: !!cachedUser && !!token,
    };
    console.log('[Auth] Initial state:', { 
      hasUser: !!initialState.user, 
      hasToken: !!token, 
      isLoading: initialState.isLoading,
      isAuthenticated: initialState.isAuthenticated 
    });
    return initialState;
  });
  const initializedRef = useRef(false);

  const loadUser = useCallback(async (showLoading = false, forceRefresh = false) => {
    console.log('[Auth] loadUser called:', { showLoading, forceRefresh });
    const token = api.getAccessToken();
    console.log('[Auth] Token status:', { hasToken: !!token });
    
    // If no token, clear state only if we don't have user data
    if (!token) {
      console.log('[Auth] No token found');
      setState(prev => {
        if (!prev.user) {
          console.log('[Auth] No user data, clearing state');
          return { user: null, isLoading: false, isAuthenticated: false };
        }
        // Preserve user data even if token is missing (might be temporary)
        console.log('[Auth] Preserving user data despite missing token');
        return { ...prev, isLoading: false };
      });
      return;
    }

    // Check if we should skip API call - use functional update to get current state
    let shouldSkip = false;
    setState(prev => {
      // If we have user data and not forcing refresh, skip API call
      if (prev.user && !forceRefresh) {
        shouldSkip = true;
        console.log('[Auth] Skipping API call - user data exists and not forcing refresh');
        return { ...prev, isLoading: false };
      }
      // Otherwise, update loading state and proceed with API call
      console.log('[Auth] Proceeding with API call');
      return { 
        ...prev, 
        isLoading: showLoading || prev.user === null 
      };
    });

    // Early return if we should skip
    if (shouldSkip) {
      return;
    }

    try {
      console.log('[Auth] Fetching user profile from API...');
      const user = await api.getProfile();
      console.log('[Auth] API response received:', { hasUser: !!user, userId: user?.id });
      if (user && user.id) {
        saveUserToStorage(user); // Cache user data
        setState({ user, isLoading: false, isAuthenticated: true });
        console.log('[Auth] User data updated successfully');
      } else {
        console.error('Invalid user data received:', user);
        // Always preserve existing user data, or try to load from cache
        setState(prev => {
          if (prev.user) {
            return { ...prev, isLoading: false };
          }
          // Try to load from cache if API returned invalid data
          const cachedUser = loadUserFromStorage();
          if (cachedUser) {
            return { user: cachedUser, isLoading: false, isAuthenticated: true };
          }
          api.setAccessToken(null);
          return { user: null, isLoading: false, isAuthenticated: false };
        });
      }
    } catch (error: any) {
      console.error('[Auth] Failed to load user profile:', error);
      
      // NEVER delete tokens - keep them even if there's an error
      // Always preserve existing user data on error, or try to load from cache
      setState(prev => {
        if (prev.user) {
          console.log('[Auth] Preserving existing user data after API error');
          // Keep existing user data - don't clear on API errors
          return { ...prev, isLoading: false };
        }
        // Try to load from cache if API call failed
        console.log('[Auth] Attempting to load from cache after API error');
        const cachedUser = loadUserFromStorage();
        if (cachedUser) {
          console.log('[Auth] Restored user from cache after API error');
          return { user: cachedUser, isLoading: false, isAuthenticated: true };
        }
        // Keep token even if we don't have cached user data
        console.log('[Auth] No cached user found, but keeping token');
        return { user: null, isLoading: false, isAuthenticated: false };
      });
    }
  }, []); // Empty deps - we use functional updates to access current state

  useEffect(() => {
    // Only load on initial mount
    if (initializedRef.current) {
      console.log('[Auth] Already initialized, skipping');
      return;
    }
    initializedRef.current = true;
    console.log('[Auth] Initializing AuthProvider');
    
    const token = api.getAccessToken();
    if (token) {
      console.log('[Auth] Token found on mount, loading user');
      loadUser(true, false);
    } else {
      console.log('[Auth] No token found on mount');
      setState(prev => ({ ...prev, isLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const login = useCallback(async (idToken: string): Promise<AuthResponse> => {
    const response = await api.googleAuth(idToken);
    api.setAccessToken(response.tokens.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.tokens.refresh_token);
    }
    saveUserToStorage(response.user); // Cache user data
    setState({ user: response.user, isLoading: false, isAuthenticated: true });
    return response;
  }, []);

  const testLogin = useCallback(async (email?: string, name?: string): Promise<AuthResponse> => {
    try {
      const response = await api.testLogin(email, name);
      
      if (response && response.tokens && response.tokens.access_token) {
        api.setAccessToken(response.tokens.access_token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', response.tokens.refresh_token);
        }
        saveUserToStorage(response.user); // Cache user data
        setState({ user: response.user, isLoading: false, isAuthenticated: true });
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Test login error:', error);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    api.setAccessToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token');
    }
    saveUserToStorage(null); // Clear cached user data
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        testLogin,
        logout,
        refreshUser: () => {
          console.log('[Auth] refreshUser called explicitly');
          return loadUser(true, true); // Force refresh when explicitly called
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}







