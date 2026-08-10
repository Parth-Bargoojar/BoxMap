'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, LogOut } from 'lucide-react'
import { signOut } from '@/lib/supabase/client'

export default function Header() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <header className="h-16 border-b border-border bg-surface px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/" className="font-bold text-xl text-primary tracking-tight">
          BoxMap
        </Link>
      </div>

      <div className="flex-1 hidden md:block">
        <h2 className="text-sm font-semibold text-text-secondary">Know what&apos;s where.</h2>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/boxes/new">
          <Button size="sm" className="gap-1 font-semibold">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Box</span>
          </Button>
        </Link>

        <Button variant="ghost" size="icon" title="Sign Out" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 text-text-muted hover:text-error" />
        </Button>
      </div>
    </header>
  )
}