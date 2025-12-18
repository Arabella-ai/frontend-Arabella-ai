'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Template } from '@/types';
import { getImageUrl, getFallbackImageUrl } from '@/lib/image-utils';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const originalUrl = template.thumbnail_url || '';
  const imageUrl = getImageUrl(originalUrl);
  const fallbackUrl = getFallbackImageUrl();
  
  const handleImageError = () => {
    if (retryCount === 0 && originalUrl.includes('nanobanana.uz')) {
      // First error with nanobanana.uz - might be a transient issue, don't log yet
      setRetryCount(1);
      return;
    }
    console.error(`Failed to load image for ${template.name}:`, originalUrl);
    setImageError(true);
  };
  
  return (
    <Link href={`/template/${template.id}`}>
      <article className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer bg-dark-950 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/20">
        {/* Thumbnail Image - always render if URL exists */}
        {imageUrl && !imageError && (
          <img
            src={imageUrl}
            alt={template.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        )}
        
        {/* Fallback image or background - shows if image fails */}
        {imageError && (
          <>
            <img
              src={fallbackUrl}
              alt={`${template.name} (placeholder)`}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-dark-950/80" />
          </>
        )}
        
        {/* Gradient Overlay - Subtle for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Premium Badge */}
        {template.is_premium && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white z-10 shadow-lg backdrop-blur-sm">
            PRO
          </div>
        )}
        
        {/* Title and Info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 lg:p-6">
          <h3 className="text-white font-bold text-base lg:text-lg leading-tight mb-2 drop-shadow-2xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7)' }}>
            {template.name}
          </h3>
          {/* Desktop: Show additional info */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {template.credit_cost} credits
            </span>
            {template.estimated_time_seconds && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {Math.round(template.estimated_time_seconds / 60)}min
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

