export const AppConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  mediaUrl:
    process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/media-storage`
      : 'http://localhost:8000/media-storage',
  package: 'web-client',
};
