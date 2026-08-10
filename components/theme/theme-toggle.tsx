'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/hooks/use-mounted'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  // resolvedTheme is only known client-side; render a stable placeholder
  // until then so the markup matches on hydration.
  const mounted = useMounted()

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary',
        'glass-subtle transition-colors hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {mounted && isDark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  )
}
