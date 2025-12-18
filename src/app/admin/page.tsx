'use client';

import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Disable static generation
export const dynamic = 'force-dynamic';

function AdminDashboardContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/admin/templates"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer"
          >
            <h2 className="text-2xl font-semibold mb-2">Templates</h2>
            <p className="text-gray-400">Manage video templates</p>
          </a>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <p className="text-gray-400">Coming soon</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-2">Videos</h2>
            <p className="text-gray-400">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}


