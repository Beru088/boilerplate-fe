'use client'

import { ReactNode } from 'react'
import SearchInput from './search-input'
import SortSelect from './sort-select'

interface QueryLayoutProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (query: string) => void
  sortValue?: 'newest' | 'oldest'
  onSortChange?: (sort: 'newest' | 'oldest') => void
  filters?: ReactNode
  showCustomizeColumn?: boolean
  customizeColumn?: ReactNode
}

export default function QueryLayout({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearch,
  sortValue = 'newest',
  onSortChange,
  filters,
  showCustomizeColumn = false,
  customizeColumn
}: QueryLayoutProps) {
  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onSearch={onSearch || (() => {})}
          className='w-80'
        />
        <SortSelect value={sortValue} onValueChange={onSortChange || (() => {})} />
      </div>

      <div className={`flex flex-wrap items-center gap-4 ${filters ? 'justify-between' : 'justify-end'}`}>
        {filters && <div className='flex w-full flex-wrap items-center justify-between gap-4'>{filters}</div>}
        {showCustomizeColumn && customizeColumn && <div className='flex items-center gap-2'>{customizeColumn}</div>}
      </div>
    </div>
  )
}
