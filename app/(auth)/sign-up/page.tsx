import type { Metadata } from 'next'
import SignUpClient from './sign-up-client'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your BoxMap account to start cataloging and mapping your physical storage inventory.',
}

export default function SignUpPage() {
  return (
    <div className="w-full max-w-[420px] px-4 py-8">
      <SignUpClient />
    </div>
  )
}