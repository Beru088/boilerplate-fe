'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

const breadcrumbConfig: Record<string, { label: string; parent?: string }> = {
  // User Management
  '/user-management': { label: 'User Management' },
  '/user-management/admin': { label: 'Admin Users', parent: '/user-management' },
  '/user-management/user': { label: 'Users', parent: '/user-management' },
  '/user-management/contributor': { label: 'Contributor Users', parent: '/user-management' },

  // Archive Management (admin)
  '/admin/archive': { label: 'Archive Management', parent: '/admin' },
  '/admin/archive/objects': { label: 'Objects', parent: '/admin/archive' },
  '/admin/archive/objects/[id]': { label: 'Object Detail', parent: '/admin/archive/objects' },
  '/admin/archive/objects/create': { label: 'Create Object', parent: '/admin/archive/objects' },
  '/admin/archive/objects/[id]/edit': { label: 'Edit Object', parent: '/admin/archive/objects' },

  // Master Data
  '/admin/master/categories': { label: 'Master Data - Category', parent: '/admin' },
  '/admin/master/materials': { label: 'Master Data - Material', parent: '/admin' },
  '/admin/master/tags': { label: 'Master Data - Tags', parent: '/admin' }
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = []

    const currentConfig = breadcrumbConfig[pathname]

    if (!currentConfig) {
      const segments = pathname.split('/').filter(Boolean)
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1]
        breadcrumbs.push({
          label: formatSegmentLabel(lastSegment),
          isCurrentPage: true
        })
      }

      return breadcrumbs
    }

    if (currentConfig.parent) {
      if (currentConfig.parent.startsWith('/')) {
        const parentConfig = breadcrumbConfig[currentConfig.parent]
        if (parentConfig) {
          if (parentConfig.parent && !parentConfig.parent.startsWith('/')) {
            breadcrumbs.push({
              label: parentConfig.parent,
              href: '#'
            })
          }
          breadcrumbs.push({
            label: parentConfig.label,
            href: currentConfig.parent
          })
        }
      } else {
        breadcrumbs.push({
          label: currentConfig.parent,
          href: '#'
        })
      }
    }

    breadcrumbs.push({
      label: currentConfig.label,
      isCurrentPage: true
    })

    return breadcrumbs
  }, [pathname])
}

function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function usePageTitle(): string {
  const pathname = usePathname()
  const config = breadcrumbConfig[pathname]

  if (config) {
    return config.label
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1]

    return formatSegmentLabel(lastSegment)
  }

  return 'Page'
}
