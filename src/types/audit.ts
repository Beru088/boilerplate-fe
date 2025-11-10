export interface IAuditLog {
  id: number
  userId?: number
  action: string
  resource: string
  resourceId?: number
  details?: any
  ipAddress?: string
  userAgent?: string
  timestamp: string
  success: boolean
  errorMessage?: string
  user?: {
    id: number
    fullname: string
    username: string
    email: string
  }
}

export interface IAuditLogQuery {
  userId?: number
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
  success?: boolean
  page?: number
  limit?: number
}

export interface IAuditStats {
  totalLogs: number
  successLogs: number
  errorLogs: number
  successRate: number
  uniqueUsers: number
  topActions: Array<{
    action: string
    _count: { action: number }
  }>
  topResources: Array<{
    resource: string
    _count: { resource: number }
  }>
}
