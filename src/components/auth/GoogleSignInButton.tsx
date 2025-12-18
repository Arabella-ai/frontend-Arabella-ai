'use client';

import { useState } from 'react';
import { Button, GoogleIcon } from '@/components/ui';

interface GoogleSignInButtonProps {
  onSuccess?: (idToken: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  variant?: 'primary' | 'outline';
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  className = '',
  variant = 'primary',
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // In production, this would use Google Sign-In SDK
      // For now, we'll simulate the flow
      if (typeof window !== 'undefined' && (window as any).google) {
        // Google Sign-In is available
        const google = (window as any).google;
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        
        if (!clientId) {
          throw new Error('Google Client ID not configured');
        }
        
        console.log('[GoogleSignIn] Initializing Google Sign-In...');
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            console.log('[GoogleSignIn] Callback received:', { 
              hasCredential: !!response.credential, 
              error: response.error 
            });
            
            if (response.credential) {
              onSuccess?.(response.credential);
            } else if (response.error) {
              console.error('[GoogleSignIn] Error:', response.error);
              onError?.(new Error(`Google Sign-In error: ${response.error}`));
            }
            setIsLoading(false);
          },
        });
        console.log('[GoogleSignIn] Prompting user...');
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('[GoogleSignIn] Prompt not displayed:', notification.getNotDisplayedReason());
            setIsLoading(false);
          }
        });
      } else {
        // Fallback or demo mode
        console.error('[GoogleSignIn] Google Sign-In SDK not available');
        onError?.(new Error('Google Sign-In not available. Please refresh the page.'));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[GoogleSignIn] Error:', error);
      onError?.(error as Error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="lg"
      fullWidth
      onClick={handleSignIn}
      isLoading={isLoading}
      icon={<GoogleIcon className="w-5 h-5" />}
      className={className}
    >
      Continue with Google
    </Button>
  );
}


