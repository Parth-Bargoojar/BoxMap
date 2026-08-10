import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardTo = next.startsWith('/') ? next : '/'
      return NextResponse.redirect(`${origin}${forwardTo}`)
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=Could%20not%20authenticate%20user`)
}