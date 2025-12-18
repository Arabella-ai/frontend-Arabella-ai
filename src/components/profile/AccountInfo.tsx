'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/types';

interface AccountInfoProps {
  user: User;
}

export function AccountInfo({ user }: AccountInfoProps) {
  const [avatarError, setAvatarError] = useState(false);

  // Reset avatar error when user changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.id, user?.avatar_url]);

  // Log user data to ensure it's being passed correctly
  useEffect(() => {
    console.log('[AccountInfo] User data:', {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      credits: user?.credits,
    });
  }, [user]);

  // Ensure we always have display values
  const displayName = (user?.name && user.name.trim().length > 0) 
    ? user.name.trim() 
    : 'User';
  const displayEmail = (user?.email && user.email.trim().length > 0)
    ? user.email.trim()
    : 'No email';
  const displayCredits = typeof user?.credits === 'number' ? user.credits : 0;
  const initials = displayName.length > 0 && displayName !== 'User'
    ? displayName.charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-4">
        {user.avatar_url && !avatarError ? (
          <img
            src={user.avatar_url}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{displayName}</p>
          <p className="text-white/50 text-sm truncate">{displayEmail}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-semibold">{displayCredits}</p>
          <p className="text-white/50 text-xs">credits</p>
        </div>
      </div>
    </div>
  );
}







