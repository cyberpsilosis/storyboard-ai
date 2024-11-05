import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchCredits } from '@/lib/together';
import { fetchPerplexityCredits } from '@/lib/perplexity';
import { supabase } from '@/lib/supabase';

interface CreditsContextType {
  togetherCredits: { text: number; image: number } | null;
  perplexityCredits: number | null;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

interface CreditsProviderProps {
  children: ReactNode;
  session?: any;
}

export function CreditsProvider({ children, session: initialSession }: CreditsProviderProps) {
  const [session, setSession] = useState<any>(initialSession);
  const [togetherCredits, setTogetherCredits] = useState<{ text: number; image: number } | null>(null);
  const [perplexityCredits, setPerplexityCredits] = useState<number | null>(null);

  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
    } else {
      // Get initial session only if not provided
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [initialSession]);

  const refreshCredits = async () => {
    if (!session) {
      console.error('No session available');
      return;
    }

    try {
      console.log('Refreshing credits with session:', session);
      const [together, perplexity] = await Promise.all([
        fetchCredits(session),
        fetchPerplexityCredits(session)
      ]);

      setTogetherCredits(together);
      setPerplexityCredits(perplexity);
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  useEffect(() => {
    if (session) {
      console.log('Session changed, refreshing credits');
      refreshCredits();
    }
  }, [session]);

  return (
    <CreditsContext.Provider value={{ togetherCredits, perplexityCredits, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
} 