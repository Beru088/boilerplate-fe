'use client'

import { ChevronDown, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'

export function AppMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
      isActive?: boolean
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => {
          const isMainItemActive =
            pathname === item.url || item.items?.some(subItem => pathname === subItem.url) || item.isActive
          const shouldBeOpen = isMainItemActive || item.isActive

          return (
            <Collapsible key={item.title} asChild defaultOpen={shouldBeOpen} className='group/collapsible'>
              <SidebarMenuItem className='relative z-10 gap-4'>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={pathname === item.url} asChild={item.url !== '#'}>
                    {item.url !== '#' ? (
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items && item.items.length > 0 && (
                          <ChevronDown className='ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-180' />
                        )}
                      </Link>
                    ) : (
                      <>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items && item.items.length > 0 && (
                          <ChevronDown className='ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-180' />
                        )}
                      </>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent className='data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 overflow-hidden transition-all duration-300 ease-in-out'>
                    <SidebarMenuSub className='relative z-0'>
                      {item.items.map(subItem => (
                        <SidebarMenuSubItem key={subItem.title} className='relative z-0'>
                          <SidebarMenuSubButton isActive={pathname === subItem.url} asChild>
                            <Link href={subItem.url} className='relative z-0'>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
