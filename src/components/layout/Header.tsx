'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@/components/ui';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  transparent?: boolean;
}

export function Header({ title, subtitle, showBack, transparent }: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`sticky top-0 z-40 ${
        transparent ? 'bg-transparent' : 'bg-dark-950/90 backdrop-blur-lg border-b border-white/10'
      }`}
    >
      <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-8 max-w-7xl mx-auto">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 lg:ml-0 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex flex-col items-center">
          <h1 className="text-lg lg:text-2xl font-semibold lg:font-bold text-white">{title}</h1>
          {subtitle && (
            <span className="text-xs lg:text-sm text-white/50">{subtitle}</span>
          )}
        </div>

        <div className="w-10" />
      </div>
    </header>
  );
}



