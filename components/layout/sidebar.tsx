'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Package, Search, Settings, LogOut, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/supabase/client'

/**
 * Desktop rail. Holds the single persistent "Add Box" primary action for
 * md+ viewports — page headers deliberately don't repeat it. Below md the
 * bottom-nav FAB is the one primary path instead.
 */
export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Boxes', href: '/boxes', icon: Package },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <aside
      aria-label="Desktop sidebar"
      className="glass-chrome sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-glass-hairline p-4 md:flex"
    >
      <div className="px-2 pt-2">
        <Link
          href="/"
          className="rounded-lg text-2xl font-bold tracking-tight text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          BoxMap
        </Link>
        <p className="mt-0.5 text-xs text-text-muted">Know what&apos;s where.</p>
      </div>

      <Link href="/boxes/new" className="mt-6 block">
        <Button size="lg" className="h-11 w-full gap-2 rounded-xl font-semibold">
          <Plus className="h-4 w-4" />
          Add Box
        </Button>
      </Link>

      <nav aria-label="Main navigation" className="mt-6 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : item.href === '/boxes'
                ? pathname === '/boxes' ||
                  (pathname.startsWith('/boxes/') && !pathname.startsWith('/boxes/new'))
                : pathname === item.href || pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'glass-subtle font-semibold text-primary shadow-glass'
                  : 'text-text-secondary hover:bg-glass-subtle hover:text-text-primary'
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-glass-hairline pt-3">
        <Button
          variant="ghost"
          className="min-h-[44px] w-full justify-start gap-3 text-text-secondary hover:bg-error-soft hover:text-error"
          onClick={handleSignOut}
          aria-label="Sign out of your account"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
