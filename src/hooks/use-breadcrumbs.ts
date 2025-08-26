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

  // Archive Management
  '/dashboard': { label: 'Historia Dashboard' },
  '/object-archive': { label: 'Objects Archive' },
  '/object-archive/[id]': { label: 'Object Detail', parent: '/object-archive' },
  '/object-archive/create': { label: 'Create Object', parent: '/object-archive' },
  '/object-archive/[id]/edit': { label: 'Edit Object', parent: '/object-archive' },

  // Master Data
  '/master': { label: 'Master Data' },
  '/master/categories': { label: 'Category', parent: '/master' },
  '/master/materials': { label: 'Material', parent: '/master' },
  '/master/tags': { label: 'Tags', parent: '/master' },
  '/master/locations': { label: 'Locations', parent: '/master' },
  '/master/sub-locations': { label: 'Sub-Locations', parent: '/master' }
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
