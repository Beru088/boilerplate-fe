import { AppConfig } from '@/configs/api'
import { IUser } from '@/types/users'

export const isAdmin = (user: IUser) => {
  return user?.role?.name === 'admin' || user?.role?.name === 'superadmin'
}

export const isContributor = (user: IUser) => {
  return user?.role?.name !== 'viewer'
}

export const getMediaUrl = (path: string) => {
  if (!path) return ''

  return `${AppConfig.mediaUrl}/${path}`
}

export const formatIsoDate = (iso?: string | Date) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  return d.toLocaleString()
}
