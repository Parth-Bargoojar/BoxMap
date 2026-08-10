'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    <form onSubmit={handleSearch} className={cn('relative w-full', className)} role="search">
      <div className="relative flex w-full items-center">
        {/* z-10: flex items paint in document order, so the translucent input
            would otherwise cover these overlays. */}
        <Search className="pointer-events-none absolute left-4 z-10 h-5 w-5 text-text-muted" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search your inventory"
          className="glass-strong h-14 rounded-2xl border-glass-border pr-11 pl-12 text-base font-normal shadow-glass [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 z-10 rounded-full p-1.5 text-text-muted transition-colors hover:bg-accent hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}
