'use client';

import { Suspense } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-30">
        <Sidebar />
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <div className="flex-1 flex flex-col pb-16 lg:pb-0">
          <Suspense fallback={<div className="flex-1" />}>
            {children}
          </Suspense>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation - hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>
    </div>
  );
}



