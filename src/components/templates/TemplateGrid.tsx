'use client';

import { TemplateCard } from './TemplateCard';
import type { Template } from '@/types';

interface TemplateGridProps {
  templates: Template[];
  isLoading?: boolean;
}

export function TemplateGrid({ templates, isLoading }: TemplateGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-white/50 text-lg">No templates available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}



