import type { AuthResponse, Template, VideoJob, VideoGenerationResponse, User, PaginatedResponse } from '@/types';

// API base URL - use same domain as frontend (proxied through nginx)
// This avoids SSL certificate issues with api.arabella.uz
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response isn't JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        console.error(`[API] Request failed: ${url}`, {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
        });
        throw new Error(errorMessage);
      }

      // Handle 204 No Content (DELETE requests) - no body to parse
      if (response.status === 204) {
        return undefined as T;
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }

      // For empty responses, return undefined
      return undefined as T;
    } catch (err) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', err);
      }
      throw err;
    }
  }

  // Auth endpoints
  async googleAuth(idToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  }

  async testLogin(email?: string, name?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/test', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // Template endpoints
  async getTemplates(): Promise<Template[]> {
    const response = await this.request<{ templates: Template[]; total: number; page: number; page_size: number; total_pages: number }>('/templates');
    // Backend returns { templates: [...], total, page, ... } but we need just the array
    return response.templates || [];
  }

  async getTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}`);
  }

  async getPopularTemplates(): Promise<Template[]> {
    return this.request<Template[]>('/templates/popular');
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/templates/categories');
  }

  // Video endpoints
  async generateVideo(templateId: string, prompt: string): Promise<VideoGenerationResponse> {
    return this.request<VideoGenerationResponse>('/videos/generate', {
      method: 'POST',
      body: JSON.stringify({ template_id: templateId, prompt }),
    });
  }

  async getVideoStatus(id: string): Promise<VideoJob> {
    return this.request<VideoJob>(`/videos/${id}/status`);
  }

  async getUserVideos(): Promise<VideoJob[]> {
    return this.request<VideoJob[]>('/videos');
  }

  async getRecentVideos(): Promise<VideoJob[]> {
    return this.request<VideoJob[]>('/videos/recent');
  }

  // User endpoints
  async getProfile(): Promise<User> {
    return this.request<User>('/user/profile');
  }

  async getCredits(): Promise<{ credits: number }> {
    return this.request<{ credits: number }>('/user/credits');
  }

  // Admin endpoints
  async createTemplate(template: Partial<Template>): Promise<Template> {
    return this.request<Template>('/admin/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const endpoint = `/admin/templates/${id}`;
    console.log('[API] updateTemplate called:', { id, endpoint, template });
    return this.request<Template>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    return this.request<void>(`/admin/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin user endpoints
  async getUsers(page: number = 1, pageSize: number = 20): Promise<{ users: User[]; total: number; page: number; page_size: number; total_pages: number }> {
    return this.request<{ users: User[]; total: number; page: number; page_size: number; total_pages: number }>(`/admin/users?page=${page}&page_size=${pageSize}`);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();

