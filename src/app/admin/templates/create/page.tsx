'use client';

import { useForm } from '@refinedev/react-hook-form';
import { useNavigation } from '@refinedev/core';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ImageUpload } from '@/components/admin/ImageUpload';

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

export default function CreateTemplate() {
  const router = useRouter();
  const { list } = useNavigation();

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(templateSchema) as any,
    defaultValues: {
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

  const onSubmit = async (data: any) => {
    try {
      // Ensure default_params is set
      const templateData = {
        ...data,
        default_params: data.default_params || {
          duration: 5,
          resolution: '720p',
          aspect_ratio: '16:9',
          fps: 30,
        },
      };
      await onFinish(templateData);
      router.push('/admin/templates');
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Create Template</h1>

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
              <ImageUpload
                label="Thumbnail Image"
                value={watch('thumbnail_url')}
                onChange={(url) => setValue('thumbnail_url', url)}
              />
              <input
                {...register('thumbnail_url')}
                type="hidden"
              />
              {errors.thumbnail_url && (
                <p className="text-red-400 text-sm mt-1">{(errors.thumbnail_url as any)?.message}</p>
              )}
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
                  defaultChecked
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
              {formLoading ? 'Creating...' : 'Create Template'}
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


