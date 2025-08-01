import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env'

/**
 * Creates a Supabase client for client-side operations
 * @returns A Supabase client instance
 */
export const createClient = () =>
  createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )

// Re-export types for convenience
export type { Database } from '@/types/supabase'
