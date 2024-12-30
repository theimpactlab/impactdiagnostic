'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { setAuth } from '@/lib/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (username === 'admin' && password === 'password') {
        setAuth()
        document.cookie = 'auth=true; path=/'
        window.location.href = '/dashboard'
      } else {
        setError('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="https://www.trustimpact.com/wp-content/uploads/2020/09/trust-impact-logo.png" 
            alt="Trust Impact Logo" 
            className="h-16 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Impact Diagnostic Assessment Tool
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to access the assessment tool
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-[#f7d32e] text-black hover:bg-[#e6c41d] font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

