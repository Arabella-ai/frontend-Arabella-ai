'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button, ClockIcon, CreditIcon, VideoIcon } from '@/components/ui';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { GenerationProgress } from '@/components/video/GenerationProgress';
import { api } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import { getImageUrl } from '@/lib/image-utils';
import type { Template, VideoJob } from '@/types';

// Mock template for demo
const mockTemplate: Template = {
  id: '1',
  name: 'Cyberpunk City Intro',
  category: 'intro',
  description: 'Create stunning cyberpunk city intros',
  thumbnail_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop',
  base_prompt: 'A futuristic cyberpunk city street at night, wet pavement reflecting neon pink and green lights, flying cars passing overhead, steam rising from vents, cinematic lighting, 8k resolution.',
  default_params: { duration: 15, resolution: '1080p' },
  credit_cost: 5,
  estimated_time_seconds: 120,
  is_premium: false,
  is_active: true,
  tags: ['cyberpunk', 'intro', 'city'],
  usage_count: 1250,
  created_at: new Date(Date.now() - 120000).toISOString(),
  updated_at: new Date(Date.now() - 120000).toISOString(),
};

type ViewState = 'edit' | 'generating' | 'completed';

export default function TemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState<ViewState>('edit');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('pending');
  const [videoJob, setVideoJob] = useState<VideoJob | null>(null);

  // Fetch template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await api.getTemplate(templateId);
        setTemplate(data);
        setPrompt(data.base_prompt);
      } catch (error) {
        // Use mock data for demo
        setTemplate(mockTemplate);
        setPrompt(mockTemplate.base_prompt);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  // Poll for job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const job = await api.getVideoStatus(jobId);
      setProgress(job.progress);
      setStatus(job.status);
      setVideoJob(job);

      if (job.status === 'completed') {
        // Show video immediately when completed
        setViewState('completed');
      } else if (job.status === 'failed') {
        setViewState('edit');
        // Extract user-friendly error message
        let errorMessage = job.error_message || 'Unknown error';
        
        // Check if it's an inappropriate content error
        if (errorMessage.includes('DatalnspectionFailed') || 
            errorMessage.toLowerCase().includes('inappropriate content')) {
          // Extract the user-friendly message if it exists
          const inappropriateMatch = errorMessage.match(/Input data may contain inappropriate content[^.]*/i);
          if (inappropriateMatch) {
            errorMessage = inappropriateMatch[0];
          } else {
            errorMessage = 'Input data may contain inappropriate content. Please modify your prompt and try again.';
          }
        } else if (errorMessage.includes('DashScope error:')) {
          // Extract the message part after "DashScope error: CODE - "
          const match = errorMessage.match(/DashScope error: [^-]+ - (.+)/);
          if (match && match[1]) {
            errorMessage = match[1].trim();
          }
        }
        
        alert(errorMessage);
      } else {
        // Continue polling with 1 second interval
        setTimeout(() => pollJobStatus(jobId), 1000);
      }
    } catch (error) {
      console.error('Failed to poll job status:', error);
      // Retry after 1 second on error
      setTimeout(() => pollJobStatus(jobId), 1000);
    }
  }, []);

  // Simulate generation for demo (reduced to 1 second total)
  const simulateGeneration = useCallback(() => {
    setViewState('generating');
    setProgress(0);
    setStatus('processing');

    // Quick simulation - complete in 1 second
    const stages = [
      { progress: 50, status: 'processing', delay: 500 },
      { progress: 100, status: 'completed', delay: 500 },
    ];

    let currentStage = 0;
    const runStage = () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setProgress(stage.progress);
        setStatus(stage.status);
        currentStage++;
        
        if (stage.status === 'completed') {
          setVideoJob({
            id: 'demo-job',
            user_id: 'demo-user',
            template_id: templateId,
            prompt,
            params: template?.default_params || {},
            status: 'completed',
            progress: 100,
            video_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            thumbnail_url: template?.thumbnail_url,
            duration_seconds: 15,
            credits_charged: template?.credit_cost || 5,
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          });
          setViewState('completed');
        } else {
          setTimeout(runStage, stage.delay);
        }
      }
    };

    setTimeout(runStage, 100);
  }, [templateId, prompt, template]);

  const handleGenerate = async () => {
    if (!template) return;

    try {
      console.log('[Template] Generating video...', { templateId, prompt });
      // Try API first
      const response = await api.generateVideo(templateId, prompt);
      console.log('[Template] Full API response:', response);
      console.log('[Template] Job ID from response:', response.job_id);
      
      if (!response.job_id) {
        console.error('[Template] No job_id in response:', response);
        throw new Error('No job_id received from server');
      }
      
      console.log('[Template] Video generation started:', response.job_id);
      setViewState('generating');
      setProgress(0);
      pollJobStatus(response.job_id);
    } catch (error: any) {
      console.error('[Template] Video generation error:', error);
      
      // Check if it's an authentication error (expired token, invalid token, etc.)
      const isAuthError = error?.message?.includes('expired') || 
                         error?.message?.includes('Authentication') || 
                         error?.message?.includes('Session') ||
                         error?.message?.includes('Invalid or expired token') ||
                         error?.message?.includes('UNAUTHORIZED') ||
                         error?.message?.includes('INVALID_TOKEN') ||
                         error?.status === 401 ||
                         error?.response?.status === 401;
      
      if (isAuthError) {
        // Show user-friendly message about expired token
        alert('Your authentication token has expired. Please sign in again to continue generating videos.');
        // Don't delete the token - let the user decide what to do
        return;
      }
      
      // Check if it's an inappropriate content error
      let errorMessage = error?.message || 'Video generation failed. Please try again.';
      if (errorMessage.includes('DatalnspectionFailed') || 
          errorMessage.toLowerCase().includes('inappropriate content')) {
        // Extract the user-friendly message if it exists
        const inappropriateMatch = errorMessage.match(/Input data may contain inappropriate content[^.]*/i);
        if (inappropriateMatch) {
          errorMessage = inappropriateMatch[0];
        } else {
          errorMessage = 'Input data may contain inappropriate content. Please modify your prompt and try again.';
        }
      } else if (errorMessage.includes('DashScope error:')) {
        // Extract the message part after "DashScope error: CODE - "
        const match = errorMessage.match(/DashScope error: [^-]+ - (.+)/);
        if (match && match[1]) {
          errorMessage = match[1].trim();
        }
      }
      
      alert(errorMessage);
      
      // Fall back to simulation for demo
      console.log('[Template] Falling back to simulation');
      simulateGeneration();
    }
  };

  const handleDownload = () => {
    if (videoJob?.video_url) {
      window.open(videoJob.video_url, '_blank');
    }
  };

  const handleShare = async () => {
    if (videoJob?.video_url && navigator.share) {
      try {
        await navigator.share({
          title: template?.name || 'AI Generated Video',
          url: videoJob.video_url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  if (isLoading || !template) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400" />
      </div>
    );
  }

  // Generating view
  if (viewState === 'generating') {
    return (
      <main className="flex-1 bg-dark-950">
        <GenerationProgress progress={progress} status={status} />
      </main>
    );
  }

  // Completed view - show video when job is completed
  if (viewState === 'completed' && videoJob && videoJob.video_url) {
    return (
      <main className="flex-1 bg-dark-950">
        <Header
          title={template.name}
          subtitle={`Generated ${formatTimeAgo(videoJob.completed_at || new Date())}`}
          showBack
        />

        <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
          {/* Video Player */}
          <VideoPlayer
            src={videoJob.video_url}
            poster={videoJob.thumbnail_url || template.thumbnail_url}
            duration={videoJob.duration_seconds || 15}
          />

          {/* Status Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-400 font-medium text-sm">VIDEO READY</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleDownload}
              icon={<VideoIcon className="w-5 h-5" />}
            >
              Download Video
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleShare}
            >
              Share Video
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Edit view (default)
  return (
    <main className="flex-1 min-h-screen pb-32 lg:pb-8 fade-in">
      <Header
        title={template.name}
        subtitle={`Edited ${formatTimeAgo(template.updated_at)}`}
        showBack
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Preview Image */}
          <div className="aspect-video lg:aspect-square lg:sticky lg:top-20 relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            {template.thumbnail_url && (
              <img
                src={getImageUrl(template.thumbnail_url)}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Prompt Input and Info */}
          <div className="py-6 lg:py-8 space-y-6">
            {/* Template Info - Desktop */}
            <div className="hidden lg:block space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{template.name}</h2>
                {template.description && (
                  <p className="text-white/70">{template.description}</p>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <CreditIcon className="w-4 h-4" />
                  <span>{template.credit_cost} credits</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <ClockIcon className="w-4 h-4" />
                  <span>{Math.round(template.estimated_time_seconds / 60)} min</span>
                </div>
                {template.usage_count > 0 && (
                  <div className="flex items-center gap-2 text-white/70">
                    <VideoIcon className="w-4 h-4" />
                    <span>{template.usage_count} uses</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-medium text-sm lg:text-base">
                  Video Description
                </label>
                <span className="text-white/40 text-sm">
                  {prompt.length}/5000
                </span>
              </div>

              <div className="glass-card p-4 lg:p-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 5000))}
                  placeholder="Describe your video in detail..."
                  maxLength={5000}
                  className="w-full h-32 lg:h-40 bg-transparent text-white placeholder-white/40 resize-none focus:outline-none text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Generate Button - Desktop */}
            <div className="hidden lg:block space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>Est. {Math.floor(template.estimated_time_seconds / 60)} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditIcon className="w-4 h-4" />
                  <span>Cost: <span className="text-primary-400 font-semibold">{template.credit_cost} credits</span></span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleGenerate}
                icon={<VideoIcon className="w-5 h-5" />}
                className="h-14 text-lg font-semibold"
              >
                Generate Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile only */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-dark-950/95 backdrop-blur-lg border-t border-white/10 safe-area-bottom">
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Info Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-white/60">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm">Est. Time: {Math.floor(template.estimated_time_seconds / 60)}m</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditIcon className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Cost:</span>
              <span className="text-sm text-blue-400 font-semibold">
                {template.credit_cost} credits
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleGenerate}
            icon={<VideoIcon className="w-5 h-5" />}
          >
            Generate Video
          </Button>
        </div>
      </div>
    </main>
  );
}



