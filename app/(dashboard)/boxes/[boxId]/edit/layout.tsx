import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Box',
  robots: { index: false, follow: false },
}

export default function EditBoxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
