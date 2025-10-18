'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUp, ArrowDown } from 'lucide-react'

export type SortOption = 'newest' | 'oldest'

interface SortSelectProps {
  value: SortOption
  onValueChange: (value: SortOption) => void
  className?: string
  placeholder?: string
}

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: ArrowDown },
  { value: 'oldest', label: 'Oldest First', icon: ArrowUp }
] as const

export default function SortSelect({ value, onValueChange, className, placeholder = 'Sort by' }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map(option => {
          const Icon = option.icon
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className='flex items-center gap-2'>
                <Icon className='h-4 w-4' />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
