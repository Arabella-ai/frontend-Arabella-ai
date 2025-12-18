'use client';

import { useForm } from '@refinedev/react-hook-form';
import { useNavigation } from '@refinedev/core';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { api } from '@/lib/api';
import type { Template } from '@/types';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  base_prompt: z.string().min(1, 'Base prompt is required'),
  thumbnail_url: z.string().optional(),
  preview_video_url: z.string().optional(),
  credit_cost: z.number().min(1, 'Credit cost must be at least 1'),
  estimated_time_seconds: z.number().min(1, 'Estimated time must be at least 1'),
  is_premium: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  default_params: z.object({
    duration: z.number().default(5),
    resolution: z.string().default('720p'),
    aspect_ratio: z.string().default('16:9'),
    fps: z.number().default(30),
  }).optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function EditTemplate() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { list } = useNavigation();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await api.getTemplate(id);
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(templateSchema) as any,
    refineCoreProps: {
      resource: 'templates',
      id: id, // Explicitly pass the ID
    },
    defaultValues: template || {
      name: '',
      category: '',
      description: '',
      base_prompt: '',
      thumbnail_url: '',
      preview_video_url: '',
      is_premium: false,
      is_active: true,
      credit_cost: 1,
      estimated_time_seconds: 60,
      tags: [],
      default_params: {
        duration: 5,
        resolution: '720p',
        aspect_ratio: '16:9',
        fps: 30,
      },
    },
  });

  // Reset form when template data loads
  useEffect(() => {
    if (template) {
      reset(template);
    }
  }, [template, reset]);

  const onSubmit = async (data: any) => {
    try {
      // Ensure default_params is set
      const templateData = {
        ...data,
        // Don't include id here - it comes from the route via refineCoreProps
        default_params: data.default_params || {
          duration: 5,
          resolution: '720p',
          aspect_ratio: '16:9',
          fps: 30,
        },
      };
      console.log('[EditTemplate] Submitting:', { id, templateData });
      await onFinish(templateData);
      router.push('/admin/templates');
    } catch (error) {
      console.error('Error updating template:', error);
      alert(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        <div className="container mx-auto">Loading...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        <div className="container mx-auto">Template not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Edit Template</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{(errors.name as any)?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="cyberpunk_intro">Cyberpunk Intro</option>
                <option value="product_showcase">Product Showcase</option>
                <option value="daily_vlog">Daily Vlog</option>
                <option value="tech_review">Tech Review</option>
                <option value="nature">Nature</option>
                <option value="abstract">Abstract</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{(errors.category as any)?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{(errors.description as any)?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Base Prompt *</label>
              <textarea
                {...register('base_prompt')}
                rows={3}
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.base_prompt && (
                <p className="text-red-400 text-sm mt-1">{(errors.base_prompt as any)?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
              <input
                {...register('thumbnail_url')}
                type="url"
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preview Video URL</label>
              <input
                {...register('preview_video_url')}
                type="url"
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Credit Cost *</label>
                <input
                  {...register('credit_cost', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.credit_cost && (
                  <p className="text-red-400 text-sm mt-1">{(errors.credit_cost as any)?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Time (seconds) *</label>
                <input
                  {...register('estimated_time_seconds', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.estimated_time_seconds && (
                  <p className="text-red-400 text-sm mt-1">{(errors.estimated_time_seconds as any)?.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  {...register('is_premium')}
                  type="checkbox"
                  className="w-4 h-4 rounded"
                />
                <span>Premium Template</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  {...register('is_active')}
                  type="checkbox"
                  className="w-4 h-4 rounded"
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {formLoading ? 'Updating...' : 'Update Template'}
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/admin/templates')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


