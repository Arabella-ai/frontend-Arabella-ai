'use client';

import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { ReactNode, Suspense } from 'react';
import { customDataProvider } from '@/lib/refine-data-provider';

// Disable static generation for admin pages
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <Refine
        routerProvider={routerProvider}
        dataProvider={customDataProvider}
        resources={[
          {
            name: 'templates',
            list: '/admin/templates',
            create: '/admin/templates/create',
            edit: '/admin/templates/edit/:id',
            show: '/admin/templates/show/:id',
            meta: {
              canDelete: true,
            },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        {children}
      </Refine>
    </Suspense>
  );
}


