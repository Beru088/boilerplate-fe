'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onSearch: (query: string) => void
  className?: string
  disabled?: boolean
}

export const SearchInput = ({
  placeholder = 'Search...',
  value,
  onSearch,
  className = 'w-64',
  disabled = false
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value)

  const handleSearch = () => {
    onSearch(inputValue ?? '')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className='pr-4 pl-10'
        />
      </div>
      <Button onClick={handleSearch} disabled={disabled} size='sm' variant='outline'>
        <Search className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default SearchInput
