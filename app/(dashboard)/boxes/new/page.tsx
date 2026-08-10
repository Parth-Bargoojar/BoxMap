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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Add New Box
          </h1>
          <p className="text-sm text-text-secondary">
            Create a physical box record and log its contents
          </p>
        </div>

        <AddBoxClient />
      </div>
    </PageContainer>
  )
}