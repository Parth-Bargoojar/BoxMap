import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Box Details',
  robots: { index: false, follow: false },
}

export default function BoxDetailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
