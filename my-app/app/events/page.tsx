'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchEvents, fetchUpcomingEvents, Event } from "@/lib/api/queries"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, upcomingData] = await Promise.all([
          fetchEvents(100),
          fetchUpcomingEvents()
        ])
        setEvents(eventsData)
        setUpcomingEvents(upcomingData)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load event data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const activeEvents = events.filter(event => event.is_active)
  const pastEvents = events.filter(event => !event.is_active)

  if (loading) {
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
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
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
            <div className="rounded-md bg-destructive/15 p-4 text-destructive">
              <p>{error}</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

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
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                <p className="text-muted-foreground">
                  View all events and tournaments in the Bodega Cats GC League
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-xs text-muted-foreground">
                      All events
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeEvents.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently running
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Scheduled events
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Past Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pastEvents.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Completed events
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Events scheduled to start soon
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {upcomingEvents.slice(0, 6).map((event) => (
                        <div key={event.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{event.name}</h3>
                            <Badge variant={event.is_active ? "default" : "secondary"}>
                              {event.is_active ? "Active" : "Upcoming"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {event.description || "No description available"}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>Start: {new Date(event.start_date).toLocaleDateString()}</span>
                            {event.end_date && (
                              <span>End: {new Date(event.end_date).toLocaleDateString()}</span>
                            )}
                          </div>
                          {event.location && (
                            <p className="text-xs text-muted-foreground">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Events</CardTitle>
                    <CardDescription>
                      Complete list of all events in the league
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {events.slice(0, 12).map((event) => (
                        <div key={event.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{event.name}</h3>
                            <Badge variant={event.is_active ? "default" : "outline"}>
                              {event.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Type: {event.type || "Not specified"}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>Start: {new Date(event.start_date).toLocaleDateString()}</span>
                            {event.end_date && (
                              <span>End: {new Date(event.end_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 