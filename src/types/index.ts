// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  credits: number;
  tier: UserTier;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export type UserTier = 'free' | 'premium' | 'pro';

// Auth types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Template types
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail_url: string;
  preview_video_url?: string;
  base_prompt: string;
  default_params: VideoParams;
  credit_cost: number;
  estimated_time_seconds: number;
  is_premium: boolean;
  is_active: boolean;
  tags: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface VideoParams {
  duration?: number;
  resolution?: string;
  aspect_ratio?: string;
  fps?: number;
  style?: string;
}

// Video Generation Response (from generate endpoint)
export interface VideoGenerationResponse {
  job_id: string;
  status: JobStatus;
  estimated_time: number;
  queue_position: number;
}

// Video Job types
export interface VideoJob {
  id: string;
  user_id: string;
  template_id: string;
  prompt: string;
  params: VideoParams;
  status: JobStatus;
  progress: number;
  provider?: string;
  provider_job_id?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  credits_charged: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export type JobStatus = 
  | 'pending'
  | 'processing'
  | 'diffusing'
  | 'uploading'
  | 'completed'
  | 'failed'
  | 'cancelled';

// API Response types
export interface ApiError {
  error: string;
  code: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}



