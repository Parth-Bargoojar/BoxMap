import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string) {
  const supabase = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })
}

export async function signInWithOAuth(provider: 'google' = 'google') {
  const supabase = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })
}

export async function resetPasswordForEmail(email: string) {
  const supabase = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/settings`,
  })
}

export async function signOut() {
  const supabase = createClient()
  return await supabase.auth.signOut()
}