'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchTeams, fetchTeamPerformance, Team, TeamPerformance } from "@/lib/api/queries"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [performance, setPerformance] = useState<TeamPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, performanceData] = await Promise.all([
          fetchTeams(),
          fetchTeamPerformance()
        ])
        setTeams(teamsData)
        setPerformance(performanceData)
      } catch (err) {
        console.error('Error fetching teams:', err)
        setError('Failed to load team data. Please try again later.')
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
                <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
                <p className="text-muted-foreground">
                  View all teams in the Bodega Cats GC League
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teams.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Registered teams
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performance.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Teams with matches
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performance.length > 0 ? performance[0]?.team_name : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Highest win percentage
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Win %</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performance.length > 0 
                        ? (performance.reduce((sum, t) => sum + (t.win_percentage || 0), 0) / performance.length).toFixed(1)
                        : '0.0'
                      }%
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
                    <CardTitle>Team Roster</CardTitle>
                    <CardDescription>
                      All teams in the league with their performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {teams.slice(0, 12).map((team) => {
                        const teamPerformance = performance.find(p => p.team_id === team.id)
                        return (
                          <div key={team.id} className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">{team.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {team.region || 'Region not set'}
                              </p>
                              <div className="flex items-center space-x-2">
                                {teamPerformance ? (
                                  <>
                                    <Badge variant="outline" className="text-xs">
                                      {teamPerformance.total_matches} games
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {teamPerformance.win_percentage.toFixed(1)}% win
                                    </Badge>
                                  </>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    No matches yet
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
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