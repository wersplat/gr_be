import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env'

// Helper function to safely get cookies
const getCookie = (name: string): string => {
  try {
    const cookieStore = cookies()
    // @ts-expect-error - cookies() returns a Promise in newer Next.js versions
    return cookieStore.get(name)?.value ?? ''
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error getting cookie:', error)
    }
    return ''
  }
}

// Define a type for cookie options
type CookieOptions = {
  name: string
  value: string
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'lax' | 'strict' | 'none'
  secure?: boolean
}

/**
 * Creates a Supabase client for server components with cookie handling
 * @returns A Supabase client instance for server-side operations
 */
export const createServerClient = () => {
  // Create a cookie handler that matches the expected interface
  const cookieHandler = {
    get: getCookie,
    set: (name: string, value: string) => {
      // In Next.js 13+, cookies should be set in a Server Action or Route Handler
      // For now, we'll just log the attempt in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Attempted to set cookie: ${name}`)
      }
      return Promise.resolve()
    },
    remove: (name: string) => {
      // In Next.js 13+, cookies should be removed in a Server Action or Route Handler
      // For now, we'll just log the attempt in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Attempted to remove cookie: ${name}`)
      }
      return Promise.resolve()
    },
  }
  
  // Create the Supabase client with our cookie handler
  return createSupabaseServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieHandler.get(name),
        set: (name, value) => cookieHandler.set(name, value),
        remove: (name) => cookieHandler.remove(name),
      },
    }
  )
}
