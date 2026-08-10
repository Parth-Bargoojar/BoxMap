import type { Metadata } from 'next'
import PageContainer from '@/components/layout/page-container'
import AddBoxClient from './add-box-client'

export const metadata: Metadata = {
  title: 'Add New Box',
  robots: { index: false, follow: false },
}

export default function AddBoxPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-[640px] space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Add New Box
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create a physical box record and log its contents
          </p>
        </div>

        <AddBoxClient />
      </div>
    </PageContainer>
  )
}