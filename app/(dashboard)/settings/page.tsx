'use client'

import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/hooks/use-mounted'
import { LogOut, Monitor, Moon, Sun } from 'lucide-react'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

function AppearanceControl() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="glass-subtle inline-flex gap-1 rounded-xl p-1"
    >
      {THEME_OPTIONS.map((opt) => {
        const Icon = opt.icon
        const isActive = mounted && theme === opt.value

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isActive
                ? 'glass-strong font-semibold text-primary shadow-glass'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <Icon className="h-4 w-4" />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-[720px] space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your appearance and session
          </p>
        </div>

        <Card className="shadow-glass">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how BoxMap looks on this device</CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceControl />
          </CardContent>
        </Card>

        <Card className="shadow-glass">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Session and authentication controls</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
