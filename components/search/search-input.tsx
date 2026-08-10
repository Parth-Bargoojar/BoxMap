'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  defaultValue?: string
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchInput({
  defaultValue = '',
  placeholder = 'What are you looking for?',
  className = '',
  autoFocus = false,
}: SearchInputProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/search')
    }
  }

  const handleClear = () => {
    setQuery('')
    router.push('/search')
  }

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 h-5 w-5 text-text-muted pointer-events-none" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-12 pl-12 pr-10 rounded-xl bg-surface border-border focus-visible:ring-primary text-base font-normal shadow-sm transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-secondary"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}