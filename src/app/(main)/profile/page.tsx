'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  PremiumCard,
  AccountInfo,
  AccountInfoSkeleton,
  SignInPrompt,
  SettingsList,
} from '@/components/profile';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, login, logout, refreshUser } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Refresh user data when entering profile page
  useEffect(() => {
    console.log('[Profile] Page mounted, checking user data...');
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;
    
    if (token) {
      // Always refresh to ensure we have the latest data
      console.log('[Profile] Token found, refreshing user data...');
      refreshUser();
    } else {
      console.log('[Profile] No token found');
    }
    
    // Prevent flickering on initial load
    setTimeout(() => setIsInitialLoad(false), 150);
  }, []); // Only run on mount


  // Debug logging
  useEffect(() => {
    console.log('[Profile] Render state:', { 
      hasUser: !!user, 
      userId: user?.id, 
      userName: user?.name,
      userEmail: user?.email,
      isAuthenticated, 
      isLoading 
    });
  }, [user, isAuthenticated, isLoading]);

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      await login(idToken);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <main className="flex-1 min-h-screen">
      <Header title="Profile" showBack />

      <div className={`px-4 lg:px-8 py-6 lg:py-12 max-w-4xl mx-auto space-y-6 lg:space-y-8 transition-opacity duration-300 ${isInitialLoad ? 'opacity-0' : 'opacity-100'}`}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-6 lg:space-y-8">
            <PremiumCard />
            {isLoading ? (
              <AccountInfoSkeleton />
            ) : isAuthenticated && user ? (
              <AccountInfo user={user} />
            ) : (
              <SignInPrompt onSignIn={handleGoogleSignIn} />
            )}
          </div>
          <div className="space-y-6 lg:space-y-8">
            <SettingsList />
          </div>
        </div>

        {isAuthenticated && (
          <Button
            variant="ghost"
            fullWidth
            onClick={logout}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Sign Out
          </Button>
        )}

        <p className="text-center text-white/30 text-xs">
          Arabella AI v1.0.0
        </p>
      </div>
    </main>
  );
}
