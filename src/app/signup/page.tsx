'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Church } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const supabase = createClient()
    
    try {
      // First try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // If email confirmation is disabled, user should be automatically signed in
      if (signUpData.session) {
        setMessage('Account created successfully! Redirecting to dashboard...')
        // Wait a bit longer to ensure session is fully established
        setTimeout(() => {
          router.replace('/dashboard')
        }, 2000)
      } else {
        // Try to sign in manually (fallback)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) {
          setError('Account created but failed to sign in. Please try logging in manually.')
          setTimeout(() => router.push('/login'), 2000)
        } else {
          setMessage('Account created successfully! Redirecting to dashboard...')
          // Wait longer to ensure session is established in cookies
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 2000)
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="flex aspect-square size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Church className="size-7" />
            </div>
            <div className="font-semibold text-2xl text-gray-900">Liturgy.Faith</div>
          </Link>
        </div>
        <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign up for Liturgy.Faith</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <FormField
              id="email"
              label="Email"
              inputType="email"
              value={email}
              onChange={setEmail}
              required
            />
            <FormField
              id="password"
              label="Password"
              description="Must be at least 6 characters"
              inputType="password"
              value={password}
              onChange={setPassword}
              required
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            {message && (
              <div className="text-green-500 text-sm">{message}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}