// Helper to safely get environment variables with optional default value
export function getEnvVariable(key: string, defaultValue?: string): string {
  // Try to get from process.env (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key]
    if (value) return value
  }

  // Try to get from window (browser)
  if (typeof window !== 'undefined' && (window as any).env) {
    const value = (window as any).env[key]
    if (value) return value
  }

  // Return default value if provided
  if (defaultValue !== undefined) {
    return defaultValue
  }

  // In development, provide a helpful error message
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ Missing required environment variable: ${key}`)
    console.log('Current environment variables:', process.env)
  }

  throw new Error(`Missing required environment variable: ${key}`)
}

// Export environment variables with optional defaults for development
export const SUPABASE_URL = getEnvVariable(
  'NEXT_PUBLIC_SUPABASE_URL',
  process.env.NODE_ENV === 'development' ? 'http://localhost:54321' : undefined
)

export const SUPABASE_ANON_KEY = getEnvVariable(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  process.env.NODE_ENV === 'development' 
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WoHP05E-zfzgXySgN0V8k' // Default anon key for local Supabase
    : undefined
)
