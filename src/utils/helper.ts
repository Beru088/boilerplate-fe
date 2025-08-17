import { AppConfig } from '@/configs/api'

export const getMediaUrl = (path: string) => {
  if (!path) return ''

  return `${AppConfig.mediaUrl}/${path}`
}

export const formatIsoDate = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  return d.toLocaleString()
}
