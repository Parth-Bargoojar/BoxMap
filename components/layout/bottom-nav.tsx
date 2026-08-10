'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Plus, Search, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Mobile chrome. The centre FAB is the single primary "Add Box" path below
 * md — page headers don't repeat it.
 */
export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Boxes', href: '/boxes', icon: Package },
    { label: 'Add', href: '/boxes/new', icon: Plus, isAdd: true },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <nav
      aria-label="Mobile navigation"
      className="glass-chrome fixed inset-x-0 bottom-0 z-50 flex h-[68px] items-center justify-around border-t border-glass-hairline px-2 pb-[env(safe-area-inset-bottom)] shadow-glass md:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : item.href === '/boxes'
              ? pathname === '/boxes' ||
                (pathname.startsWith('/boxes/') && !pathname.startsWith('/boxes/new'))
              : pathname === item.href || pathname.startsWith(item.href)

        if (item.isAdd) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="-mt-6 flex flex-col items-center justify-center focus-visible:outline-none"
              aria-label="Add New Box"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glass-lg ring-1 ring-glass-border transition-transform duration-200 active:scale-95">
                <Plus className="h-6 w-6" />
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-[48px] min-w-[56px] flex-col items-center justify-center rounded-xl px-2 py-1 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isActive ? 'font-semibold text-primary' : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Icon className="h-[22px] w-[22px]" />
            <span className="mt-0.5 text-[11px]">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
