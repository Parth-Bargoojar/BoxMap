'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Package, Search, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/supabase/client'

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
    <aside aria-label="Desktop sidebar" className="hidden md:flex flex-col w-[240px] border-r border-border bg-surface min-h-screen p-4">
      <div className="mb-8 px-2">
        <Link href="/" className="text-2xl font-bold text-primary tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          BoxMap
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : item.href === '/boxes'
              ? pathname === '/boxes' || (pathname.startsWith('/boxes/') && !pathname.startsWith('/boxes/new'))
              : pathname === item.href || pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-primary-soft text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-text-secondary hover:text-error hover:bg-error-soft min-h-[44px]"
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