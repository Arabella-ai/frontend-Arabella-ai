'use client';

import type { Template } from '@/types';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function TemplateList() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await api.deleteTemplate(id);
        // Refresh the list
        const data = await api.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        <div className="container mx-auto">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Templates</h1>
          <Button
            onClick={() => router.push('/admin/templates/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Template
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Credits</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Premium</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Active</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-sm">{template.name}</td>
                  <td className="px-4 py-3 text-sm">{template.category}</td>
                  <td className="px-4 py-3 text-sm">{template.credit_cost}</td>
                  <td className="px-4 py-3 text-sm">{template.is_premium ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-sm">{template.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/templates/edit/${template.id}`)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


