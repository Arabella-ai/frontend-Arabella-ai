'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TemplateGrid } from '@/components/templates/TemplateGrid';
import { api } from '@/lib/api';
import type { Template } from '@/types';

// Mock data for demonstration
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Cyberpunk Intro',
    category: 'intro',
    description: 'Futuristic cyberpunk city intro',
    thumbnail_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=600&fit=crop',
    base_prompt: 'A futuristic cyberpunk city street at night',
    default_params: { duration: 15, resolution: '1080p' },
    credit_cost: 5,
    estimated_time_seconds: 120,
    is_premium: false,
    is_active: true,
    tags: ['cyberpunk', 'intro', 'city'],
    usage_count: 1250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Product Showcase',
    category: 'product',
    description: 'Clean product showcase video',
    thumbnail_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop',
    base_prompt: 'Elegant product showcase on minimal background',
    default_params: { duration: 10, resolution: '1080p' },
    credit_cost: 3,
    estimated_time_seconds: 90,
    is_premium: false,
    is_active: true,
    tags: ['product', 'showcase', 'minimal'],
    usage_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Daily Vlog',
    category: 'vlog',
    description: 'Cozy daily vlog aesthetic',
    thumbnail_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=600&fit=crop',
    base_prompt: 'Warm cozy aesthetic for daily vlog',
    default_params: { duration: 15, resolution: '1080p' },
    credit_cost: 4,
    estimated_time_seconds: 100,
    is_premium: false,
    is_active: true,
    tags: ['vlog', 'cozy', 'aesthetic'],
    usage_count: 2100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Tech Review',
    category: 'tech',
    description: 'Modern tech review setup',
    thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    base_prompt: 'Modern tech workspace with gadgets',
    default_params: { duration: 12, resolution: '4k' },
    credit_cost: 6,
    estimated_time_seconds: 150,
    is_premium: true,
    is_active: true,
    tags: ['tech', 'review', 'modern'],
    usage_count: 560,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.getTemplates();
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
        } else {
          setTemplates(mockTemplates);
        }
      } catch (error) {
        // Fallback to mock data on error
        setTemplates(mockTemplates);
      } finally {
        setIsLoading(false);
        // Small delay to prevent flickering
        setTimeout(() => setIsInitialLoad(false), 100);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <main className="flex-1 min-h-screen">
      {/* Header - Desktop optimized */}
      <header className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="lg:hidden flex items-center justify-center flex-1 gap-2">
            <Image
              src="/logo.jpg"
              alt="Arabella"
              width={32}
              height={32}
              className="rounded-lg"
              unoptimized
            />
            <h1 className="text-xl font-semibold text-white">Arabella</h1>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Arabella"
              width={40}
              height={40}
              className="rounded-lg"
              unoptimized
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                Arabella
              </h1>
              <span className="text-xs text-white/50 block">Video Generation</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm text-white/70">Create amazing videos with AI</span>
          </div>
        </div>
      </header>

      {/* Content - Responsive container */}
      <div className="px-4 lg:px-8 py-6 lg:py-12 max-w-7xl mx-auto">
        {/* Hero Section - Desktop only */}
        <div className="hidden lg:block mb-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Create Stunning <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">AI Videos</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Transform your ideas into professional videos with our AI-powered templates
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className={`transition-opacity duration-300 ${isInitialLoad ? 'opacity-0' : 'opacity-100'}`}>
          <TemplateGrid templates={templates} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}

