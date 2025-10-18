import { AppConfig } from '@/configs/api'

export const getMediaUrl = (path: string) => {
  if (!path) return ''

  return `${AppConfig.mediaUrl}/${path}`
}

export const formatIsoDate = (iso?: string | Date) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const formatIsoDateOnly = (iso?: string | Date) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function capitalizeTag(tagName: string): string {
  if (!tagName || tagName.length === 0) return tagName
  return tagName.charAt(0).toUpperCase() + tagName.slice(1).toLowerCase()
}

export function capitalizeTags(tags: string[]): string[] {
  return tags.map(capitalizeTag)
}

export function normalizeAndCapitalizeTag(tagName: string): string {
  return capitalizeTag(tagName.trim().replace(/\s+/g, ' '))
}

export function formatActionName(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}
