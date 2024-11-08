import { useEffect, useState } from 'react'
import { ThemeProvider } from './providers/theme-provider'
import { ScriptEditor } from '@/components/ScriptEditor'
import { Toaster } from '@/components/ui/toaster'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { CreditDisplay } from '@/components/CreditDisplay'
import { StoryboardGallery } from '@/components/StoryboardGallery'
import { CreditsProvider } from '@/contexts/credits-context'
import { supabase } from '@/lib/supabase'
import { LoginForm } from '@/components/auth/login'
import { SessionProvider } from '@/contexts/session-context'

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoginForm />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <SessionProvider session={session}>
        <CreditsProvider session={session}>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <div className="container mx-auto py-8 px-4">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-text flex items-center gap-2">
                    AI Storyboard
                    <span className="sparkle-emoji">✨</span>
                  </h1>
                  <CreditDisplay />
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <Button 
                    variant="ghost" 
                    onClick={() => supabase.auth.signOut()}
                    className="text-text hover:text-text/80"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
              <div className="grid gap-8">
                <ScriptEditor />
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-6 text-text">Your Storyboards</h2>
                  <StoryboardGallery />
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </CreditsProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default App
