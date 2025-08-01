import { createClient } from './client'
import { Database } from '@/types/supabase'

type TableName = keyof Database['public']['Tables']
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']

// Event types for better type safety
export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

// Generic query functions with proper typing
export async function fetchAllFromTable<T extends TableName>(
  table: T,
  columns = '*'
): Promise<TableRow<T>[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from(table)
    .select(columns)

  if (error) {
    console.error(`Error fetching from ${table}:`, error)
    throw error
  }

  return (data || []) as unknown as TableRow<T>[]
}

export async function fetchById<T extends TableName>(
  table: T,
  id: string,
  columns = '*'
): Promise<TableRow<T> | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching ${table} with id ${id}:`, error)
    return null
  }

  return data as unknown as TableRow<T>
}

// Specific event queries
export async function fetchEvents(limit = 10): Promise<Event[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching events:', error)
    throw error
  }

  return (data || []) as unknown as Event[]
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching event with id ${id}:`, error)
    return null
  }

  return data as unknown as Event
}

export async function createEvent(event: EventInsert): Promise<Event | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return null
  }

  return data as unknown as Event
}

export async function updateEvent(
  id: string,
  updates: EventUpdate
): Promise<Event | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating event with id ${id}:`, error)
    return null
  }

  return data as unknown as Event
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting event with id ${id}:`, error)
    return false
  }

  return true
}
