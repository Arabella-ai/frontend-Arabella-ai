import { DataProvider } from '@refinedev/core';
import { api } from './api';

// Custom data provider that works with your backend API format
export const customDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    let current = 1;
    let pageSize = 10;
    
    if (pagination) {
      if (typeof pagination === 'object' && 'current' in pagination) {
        current = (pagination.current as number) || 1;
      }
      if (typeof pagination === 'object' && 'pageSize' in pagination) {
        pageSize = (pagination.pageSize as number) || 10;
      }
    }

    // Build query params
    const params = new URLSearchParams();
    params.append('page', current.toString());
    params.append('page_size', pageSize.toString());

    // Add filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === 'eq' && filter.value !== undefined) {
          params.append(filter.field, filter.value.toString());
        }
      });
    }

    // Add sorting
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      params.append('sort_by', sorter.field);
      params.append('order', sorter.order === 'asc' ? 'asc' : 'desc');
    }

    const endpoint = resource === 'templates' ? '/templates' : `/${resource}`;
    const url = `${endpoint}?${params.toString()}`;

    try {
      // Use getTemplates for templates resource, otherwise use direct fetch
      let response: any;
      if (resource === 'templates') {
        const templates = await api.getTemplates();
        response = { templates, total: templates.length };
      } else {
        // For other resources, use direct fetch
        const token = api.getAccessToken();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${url}`, { headers });
        response = await fetchResponse.json();
      }

      // Handle different response formats
      // Backend returns: { templates: [...], total: 100, page: 1, ... }
      let data: any[] = [];
      let total = 0;
      
      if (response.templates && Array.isArray(response.templates)) {
        data = response.templates;
        total = response.total || data.length;
      } else if (response[resource] && Array.isArray(response[resource])) {
        data = response[resource];
        total = response.total || data.length;
      } else if (Array.isArray(response.data)) {
        data = response.data;
        total = response.total || data.length;
      } else if (Array.isArray(response)) {
        data = response;
        total = response.length;
      }

      return {
        data,
        total,
      };
    } catch (error) {
      console.error('Refine getList error:', error);
      return {
        data: [],
        total: 0,
      };
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const idStr = String(id);
    if (resource === 'templates') {
      const data = await api.getTemplate(idStr);
      return { data };
    }
    // For other resources, use direct fetch
    const token = api.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    const endpoint = `/${resource}/${idStr}`;
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${endpoint}`, { headers });
    const data = await fetchResponse.json();
    return { data };
  },

  create: async ({ resource, variables, meta }) => {
    if (resource === 'templates') {
      const data = await api.createTemplate(variables as any);
      return { data };
    }
    // For other resources, use direct fetch
    const token = api.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    const endpoint = `/admin/${resource}`;
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(variables),
    });
    const data = await fetchResponse.json();
    return { data };
  },

  update: async ({ resource, id, variables, meta }) => {
    const idStr = String(id);
    console.log('[Refine] Update called:', { resource, id, idStr, variables });
    if (resource === 'templates') {
      // Remove id from variables if it's included (should be in route param)
      const { id: _, ...templateData } = variables as any;
      const data = await api.updateTemplate(idStr, templateData);
      return { data };
    }
    // For other resources, use direct fetch
    const token = api.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    const endpoint = `/admin/${resource}/${idStr}`;
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(variables),
    });
    const data = await fetchResponse.json();
    return { data };
  },

  deleteOne: async ({ resource, id, meta }) => {
    const idStr = String(id);
    if (resource === 'templates') {
      await api.deleteTemplate(idStr);
      return { data: { id: idStr } as any };
    }
    // For other resources, use direct fetch
    const token = api.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    const endpoint = `/admin/${resource}/${idStr}`;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return { data: { id: idStr } as any };
  },

  getApiUrl: () => {
    return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  },

  // Optional methods
  getMany: async ({ resource, ids, meta }) => {
    if (resource === 'templates') {
      const promises = ids.map((id) => api.getTemplate(String(id)));
      const data = await Promise.all(promises);
      return { data };
    }
    // For other resources, use direct fetch
    const token = api.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    const promises = ids.map(async (id) => {
      const endpoint = `/${resource}/${String(id)}`;
      const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${endpoint}`, { headers });
      return fetchResponse.json();
    });
    const data = await Promise.all(promises);
    return { data };
  },

  custom: async ({ url, method, payload, headers, meta }) => {
    const token = api.getAccessToken();
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (token) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${url}`, {
      method: method || 'GET',
      headers: requestHeaders,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const response = await fetchResponse.json();
    return { data: response };
  },
};


