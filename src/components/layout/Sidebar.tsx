'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserIcon, SparklesIcon } from '@/components/ui';

interface NavItem {
  href: string;
  label: string;
  icon: typeof HomeIcon;
}

const navItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: HomeIcon },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border-r border-white/10">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/30">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Arabella</h1>
          <p className="text-xs text-white/50">Video Generation</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-cyan-500/20 text-white border border-primary-500/30 shadow-lg shadow-primary-500/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          © 2025 Arabella
        </p>
      </div>
    </div>
  );
}

