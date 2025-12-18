export function AccountInfoSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
        </div>
        <div className="text-right space-y-2 flex-shrink-0">
          <div className="h-4 bg-white/10 rounded animate-pulse w-12" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}







