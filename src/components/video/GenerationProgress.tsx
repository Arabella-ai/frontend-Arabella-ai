'use client';

import { ProgressRing, RefreshIcon } from '@/components/ui';
import { getStatusLabel } from '@/lib/utils';

interface GenerationProgressProps {
  progress: number;
  status: string;
}

export function GenerationProgress({ progress, status }: GenerationProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8">
      {/* Progress Ring */}
      <ProgressRing progress={progress} size={220} strokeWidth={8} />

      {/* Status */}
      <div className="mt-8 flex items-center gap-2 text-white/70">
        <RefreshIcon className="w-5 h-5 animate-spin" />
        <span className="text-xl">Generating Video...</span>
      </div>

      {/* Status Label */}
      <p className="mt-2 text-sm text-white/40 uppercase tracking-wider">
        {getStatusLabel(status)}
      </p>

      {/* Loading Animation */}
      <div className="mt-6 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-blue-400/60 rounded-full"
            style={{
              height: `${12 + Math.sin((Date.now() / 200 + i) % (Math.PI * 2)) * 8}px`,
              animation: `pulse 1s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Hint */}
      <p className="mt-8 text-sm text-white/40 text-center max-w-xs">
        This may take up to 30 seconds. Please don&apos;t close the app.
      </p>
    </div>
  );
}



