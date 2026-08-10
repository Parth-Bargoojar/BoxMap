import type { Metadata } from 'next'
import SignInClient from './sign-in-client'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to BoxMap to manage and locate your storage inventory.',
}

export default function SignInPage() {
  return (
    <div className="w-full max-w-[420px] py-8">
      <SignInClient />
    </div>
  )
}