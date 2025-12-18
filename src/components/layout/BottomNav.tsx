'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserIcon } from '@/components/ui';

interface NavItem {
  href: string;
  label: string;
  icon: typeof HomeIcon;
}

const navItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: HomeIcon },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-dark-950/90 backdrop-blur-lg border-t border-white/10 safe-area-bottom transition-opacity duration-200">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-all duration-200 ${
                isActive 
                  ? 'text-white scale-105' 
                  : 'text-white/50 hover:text-white/70 hover:scale-105'
              }`}
            >
              <Icon className={`w-6 h-6 transition-all duration-200 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium transition-all duration-200">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}



