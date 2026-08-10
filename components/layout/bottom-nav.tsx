'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Plus, Search, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border px-2 flex items-center justify-around z-50 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : item.href === '/boxes'
            ? pathname === '/boxes' || (pathname.startsWith('/boxes/') && !pathname.startsWith('/boxes/new'))
            : pathname === item.href || pathname.startsWith(item.href)

        if (item.isAdd) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
              aria-label="Add New Box"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-medium text-text-secondary mt-1">Add</span>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2 min-w-[56px] min-h-[48px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg',
              isActive ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}