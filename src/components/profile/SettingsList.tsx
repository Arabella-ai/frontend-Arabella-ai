'use client';

import { useRouter } from 'next/navigation';
import { RefreshIcon, HelpIcon, StarIcon, ShieldIcon, ChevronRightIcon } from '@/components/ui';

interface SettingsItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}

const settingsItems: SettingsItem[] = [
  { icon: RefreshIcon, label: 'Restore Purchases', href: '/restore' },
  { icon: HelpIcon, label: 'Help & Support', href: '/support' },
  { icon: StarIcon, label: 'Rate App', href: '/rate' },
  { icon: ShieldIcon, label: 'Privacy Policy', href: '/privacy' },
];

export function SettingsList() {
  const router = useRouter();

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Settings</h3>
      <div className="glass-card overflow-hidden divide-y divide-white/10">
        {settingsItems.map(({ icon: Icon, label, href, onClick }) => (
          <button
            key={label}
            onClick={() => href ? router.push(href) : onClick?.()}
            className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white/70" />
            </div>
            <span className="flex-1 text-white">{label}</span>
            <ChevronRightIcon className="w-5 h-5 text-white/30" />
          </button>
        ))}
      </div>
    </div>
  );
}







