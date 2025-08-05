'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchPlayers, fetchPlayerPerformance, Player, PlayerPerformance } from "@/lib/api/queries"

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [performance, setPerformance] = useState<PlayerPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [playersData, performanceData] = await Promise.all([
          fetchPlayers(100),
          fetchPlayerPerformance(100)
        ])
        setPlayers(playersData)
        setPerformance(performanceData)
      } catch (err) {
        console.error('Error fetching players:', err)
        setError('Failed to load player data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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
                <h1 className="text-3xl font-bold tracking-tight">Players</h1>
                <p className="text-muted-foreground">
                  View all players in the Bodega Cats GC League
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{players.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Registered players
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Players</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performance.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Players with stats
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performance.length > 0 ? performance[0]?.gamertag : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Highest performance score
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performance.length > 0 
                        ? (performance.reduce((sum, p) => sum + (p.avg_performance_score || 0), 0) / performance.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      League average
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Player Roster</CardTitle>
                    <CardDescription>
                      All registered players in the league
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {players.slice(0, 12).map((player) => (
                        <div key={player.id} className="flex items-center space-x-4 rounded-lg border p-4">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{player.gamertag}</p>
                            <p className="text-xs text-muted-foreground">
                              {player.position || 'Position not set'}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                RP: {player.player_rp}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Rank: {player.player_rank_score?.toFixed(0) || 'N/A'}
                              </Badge>
                            </div>
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