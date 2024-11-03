import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    error: 'Missing Supabase environment variables',
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey
  }, null, 2))
  throw new Error('Missing required environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 