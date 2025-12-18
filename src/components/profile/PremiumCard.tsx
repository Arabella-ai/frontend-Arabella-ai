import { Button, DiamondIcon, ChevronRightIcon } from '@/components/ui';

export function PremiumCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 p-6">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="40" fill="currentColor" className="text-white" />
          <circle cx="60" cy="40" r="30" fill="currentColor" className="text-white/50" />
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/30 flex items-center justify-center">
          <DiamondIcon className="w-7 h-7 text-blue-400" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          Unlock Full Potential
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Get unlimited generations, faster processing, and 4K export quality.
        </p>

        <Button variant="secondary" size="lg" fullWidth>
          Go Premium
          <ChevronRightIcon className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}







