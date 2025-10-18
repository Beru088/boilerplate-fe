const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api'

export const AppConfig = {
  baseUrl,
  mediaUrl: `${baseUrl}/media-storage`,
  package: 'web-client'
}
