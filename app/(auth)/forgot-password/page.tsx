'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from '@/lib/validation/auth.schema'
import { resetPasswordForEmail } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setAuthError(null)
    setSuccessMsg(null)
    try {
      const { error } = await resetPasswordForEmail(data.email)
      if (error) {
        setAuthError(error.message)
        return
      }
      setSuccessMsg('Password reset instructions have been sent to your email address.')
    } catch {
      setAuthError('A network error occurred. Please check your connection and try again.')
    }
  }

  return (
    <div className="w-full max-w-[420px] px-4 py-8">
      <Card className="w-full shadow-sm border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <span className="text-2xl font-bold text-primary tracking-tight">BoxMap</span>
          </div>
          <CardTitle className="text-xl font-bold text-text-primary">Reset your password</CardTitle>
          <CardDescription className="text-text-secondary">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError && (
            <div className="p-3 text-sm text-error bg-error-soft rounded-md border border-error/20" role="alert">
              {authError}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-sm text-success bg-success-soft rounded-md border border-success/20" role="status">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending instructions...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-4">
          <p className="text-xs text-text-secondary">
            Remembered your password?{' '}
            <Link href="/sign-in" className="font-semibold text-primary hover:text-primary-hover underline-offset-4 hover:underline">
              Back to Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}