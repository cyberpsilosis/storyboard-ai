import { useEffect, useState } from 'react'
import { createClient, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { ThemeProvider } from './providers/theme-provider'
import { ScriptEditor } from '@/components/ScriptEditor'
import { ShotList } from '@/components/ShotList'
import { CharacterInputs } from '@/components/CharacterInputs'
import { Toaster } from '@/components/ui/toaster'
import { ThemeToggle } from '@/components/theme-toggle'
import { LoginForm } from '@/components/auth/login'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <ThemeProvider>
        <div className="flex min-h-screen items-center justify-center">
          <LoginForm />
        </div>
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Storyboarder</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
        <div className="grid gap-8">
          <div className="grid md:grid-cols-[2fr,1fr] gap-8">
            <ScriptEditor />
            <CharacterInputs />
          </div>
          <ShotList />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
