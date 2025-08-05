'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

const breadcrumbConfig: Record<string, { label: string; parent?: string; category?: string }> = {
  // User Management
  '/user-management': { label: 'User Management', category: 'management' },
  '/user-management/admin': { label: 'Admin Users', parent: '/user-management', category: 'management' },
  '/user-management/user': { label: 'Users', parent: '/user-management', category: 'management' },
  '/user-management/role': { label: 'Roles', parent: '/user-management', category: 'management' },

  // Object Management
  '/archive-management': { label: 'Archive Management', category: 'management' },
  '/archive-management/object': { label: 'Object', category: 'management' },
  '/archive-management/object-category': { label: 'Object Categories', category: 'management' },
  '/archive-management/object-tag': { label: 'Object Tags', category: 'management' },
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = []

    breadcrumbs.push({
      label: 'CMS',
      href: '/admin'
    })

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