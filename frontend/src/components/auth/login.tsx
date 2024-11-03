import { useState, useEffect } from 'react'
import { AuthError } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

const logError = (message: string, error: any) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    message,
    error: error?.message || error,
    stack: error?.stack,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  }, null, 2))
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...')

  // Test Supabase connection and user status
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setConnectionStatus('Connection Error')
          logError('Session check failed', sessionError)
          return
        }

        // Log the full session data for debugging
        console.log('Session data:', JSON.stringify(session, null, 2))
        
        setConnectionStatus(session ? 'Connected with session' : 'Connected, ready')
      } catch (err) {
        setConnectionStatus('Connection Failed')
        logError('Connection test error', err)
      }
    }
    testConnection()
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const cleanEmail = email.toLowerCase().trim()
    const cleanPassword = password.trim()

    // Log the attempt (but not the password)
    console.log('Attempting login:', {
      email: cleanEmail,
      hasPassword: !!cleanPassword,
      timestamp: new Date().toISOString()
    })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      })

      if (error) {
        logError('Login failed', error)
        throw error
      }

      if (data?.user) {
        console.log('Login successful:', {
          userId: data.user.id,
          email: data.user.email,
          timestamp: new Date().toISOString()
        })
        setConnectionStatus('Authenticated')
      }
    } catch (err) {
      logError('Login error', err)
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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xs mr-2">█</span>
          <span className="text-xs">TERMINAL v1.0.0</span>
        </div>
        <span className="text-xs">{connectionStatus}</span>
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