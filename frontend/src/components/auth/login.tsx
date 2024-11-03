import { useState, useEffect } from 'react'
import { AuthError } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor(c => !c)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Login attempt:', { 
        email,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        timestamp: new Date().toISOString()
      })

      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      })

      if (error) {
        console.error('Login error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        })
        throw error
      }

      console.log('Login successful')
    } catch (err) {
      console.error('Login error:', err)
      if (err instanceof AuthError) {
        setError('ACCESS DENIED: Invalid credentials')
      } else {
        setError('SYSTEM ERROR: Authentication service unavailable')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[600px] h-[400px] bg-black border-2 border-green-500 rounded-lg p-8 font-mono text-green-500 overflow-hidden">
      <div className="mb-4 flex items-center">
        <span className="text-xs mr-2">█</span>
        <span className="text-xs">TERMINAL v1.0.0</span>
      </div>
      <div className="mb-6">
        <p className="typing-effect">INITIALIZING SECURE LOGIN...</p>
        <p className="mb-4">ENTER CREDENTIALS TO CONTINUE{cursor ? '█' : ' '}</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2">{`>`}</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER EMAIL"
            className="bg-transparent border-none text-green-500 placeholder-green-700 focus:ring-0"
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">{`>`}</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER PASSWORD"
            className="bg-transparent border-none text-green-500 placeholder-green-700 focus:ring-0"
          />
        </div>
        {error && (
          <div className="text-red-500 mt-2 font-bold">
            {error}
          </div>
        )}
        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-black hover:bg-green-600 mt-4"
        >
          {loading ? 'AUTHENTICATING...' : 'LOGIN'}
        </Button>
      </form>
    </div>
  )
} 