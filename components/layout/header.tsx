import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/theme-toggle'

/**
 * Global chrome. Intentionally holds no primary action: "Add Box" lives once
 * per context (page header on desktop, bottom-nav FAB on mobile) and sign-out
 * lives in the sidebar and Settings.
 */
export default function Header() {
  return (
    <header className="glass-chrome sticky top-0 z-40 flex h-16 items-center justify-between border-b border-glass-hairline px-4 md:px-8">
      <Link
        href="/"
        className="rounded-lg text-xl font-bold tracking-tight text-primary focus-visible:outline-none md:hidden"
      >
        BoxMap
      </Link>

      <div className="hidden md:block" aria-hidden="true" />

      <ThemeToggle />
    </header>
  )
}
