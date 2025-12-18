'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, testLogin } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const handleSkipAuth = () => {
    // Just redirect to home - no API calls, no authentication
    router.push('/home');
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/home');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Wait for Google SDK to load
    const initGoogleSignIn = () => {
      if (typeof window === 'undefined' || !(window as any).google) {
        return;
      }

      if (initializedRef.current || !buttonRef.current) {
        return;
      }

      const google = (window as any).google;
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      
      if (!clientId) {
        setError('Google Client ID not configured. Please check your environment variables.');
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsSigningIn(true);
              setError(null);
              try {
                console.log('[Auth] Google Sign-In successful, processing token...');
                await login(response.credential);
                router.push('/home');
              } catch (err: any) {
                console.error('[Auth] Login error:', err);
                const errorMessage = err.message || 'Failed to sign in. Please try again.';
                setError(errorMessage);
                setIsSigningIn(false);
              }
            } else if (response.error) {
              console.error('[Auth] Google Sign-In error:', response.error);
              setError(`Sign-in error: ${response.error}. Please try again.`);
              setIsSigningIn(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button (width must be a number, not percentage)
        if (buttonRef.current) {
          const buttonWidth = buttonRef.current.offsetWidth || 300;
          google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: buttonWidth,
            text: 'signin_with',
            shape: 'rectangular',
          });
        }

        initializedRef.current = true;
      } catch (err: any) {
        console.error('Google Sign-In initialization error:', err);
        setError('Failed to initialize Google Sign-In. Please check your configuration.');
      }
    };

    // Check if Google SDK is already loaded
    if ((window as any).google) {
      initGoogleSignIn();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if ((window as any).google) {
          clearInterval(checkInterval);
          initGoogleSignIn();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!initializedRef.current) {
          setError('Google Sign-In SDK failed to load. Please refresh the page.');
        }
      }, 5000);
    }
  }, [login, router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center gradient-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col gradient-background">
      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-center px-8 max-w-lg mx-auto w-full">
        {/* Logo & Branding */}
        <div className="mb-4 flex flex-col items-center">
          <div className="mb-4">
            <Image
              src="/logo.jpg"
              alt="Arabella Logo"
              width={120}
              height={120}
              className="rounded-2xl shadow-2xl"
              unoptimized
            />
          </div>
          <h1 className="text-5xl font-light text-white tracking-tight">
            Arabella{' '}
            <span className="inline-flex items-center justify-center w-12 h-8 border border-white/40 rounded-lg text-sm font-normal">
              ai
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl text-white/80 leading-relaxed mb-12">
          Create and edit your love videos and pictures!
        </p>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pb-12 max-w-lg mx-auto w-full">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Sign-In Button Container */}
        <div ref={buttonRef} className="w-full" />
        
        {/* Skip Google Auth Button */}
        <button
          onClick={handleSkipAuth}
          disabled={isSigningIn}
          className="mt-4 w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningIn ? 'Signing in...' : 'Skip Google Sign-In (Test Mode)'}
        </button>
        
        {isSigningIn && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-white/60">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
              <span className="text-sm">Signing in...</span>
            </div>
          </div>
        )}

        {/* Terms */}
        <p className="mt-6 text-xs text-white/40 text-center">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-white/60">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-white/60">
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  );
}
