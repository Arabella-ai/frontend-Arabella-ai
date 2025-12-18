/**
 * Image utility functions for handling external images
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

/**
 * Get a proxied image URL for external images that may have issues
 * Currently proxies nanobanana.uz images through the backend
 */
export function getImageUrl(originalUrl: string | undefined | null): string {
  if (!originalUrl) {
    return '';
  }

  // If it's a nanobanana.uz image, use the backend proxy
  if (originalUrl.includes('nanobanana.uz')) {
    const encodedUrl = encodeURIComponent(originalUrl);
    return `${API_BASE_URL}/proxy/image?url=${encodedUrl}`;
  }

  // For other URLs, use directly
  return originalUrl;
}

/**
 * Get a fallback image URL if the primary image fails
 */
export function getFallbackImageUrl(): string {
  // You can use a placeholder service or a default image
  return 'https://via.placeholder.com/400x600/1a1a1a/ffffff?text=Image+Not+Available';
}

