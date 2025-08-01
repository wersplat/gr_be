// This file is auto-generated from supabase-types.json
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type AwardType = "Offensive MVP" | "Defensive MVP" | "Rookie of Tournament"
type EventTier = "T1" | "T2" | "T3" | "T4"
type EventType = "League" | "Tournament"

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          banner_url: string | null
          tier: EventTier | null
          type: EventType | null
          created_at: string
          updated_at: string | null
        }
        Insert: Partial<{
          id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          banner_url: string | null
          tier: EventTier | null
          type: EventType | null
          created_at: string
          updated_at: string | null
        }>
        Update: Partial<{
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          banner_url: string | null
          tier: EventTier | null
          type: EventType | null
          updated_at: string | null
        }>
      }
      // Add other tables as needed
    }
    Views: {
      // Add view types as needed
    }
    Functions: {
      // Add function types as needed
    }
    Enums: {
      award_types: AwardType
      event_tier: EventTier
      event_type: EventType
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Response types
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbTables = keyof Database['public']['Tables']
