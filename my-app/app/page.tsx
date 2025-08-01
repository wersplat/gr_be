'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Event, fetchEvents } from "@/lib/supabase/queries"

type TableEvent = {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

// Helper function to convert Event to TableEvent
const mapEventToTable = (event: Event): TableEvent => ({
  id: parseInt(event.id, 10) || 0,
  header: event.name || 'Untitled Event',
  type: event.type || 'Unknown',
  status: 'Active', // Default status
  target: 'All Users', // Default target
  limit: '100', // Default limit
  reviewer: 'Admin' // Default reviewer
})

export default function Page() {
  const [events, setEvents] = useState<TableEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents(10)
        setEvents(data.map(mapEventToTable))
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                  <p>{error}</p>
                </div>
              ) : (
                <DataTable data={events} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
