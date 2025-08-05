"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { fetchPlayerPerformance } from "@/lib/api/queries"

export const description = "An interactive area chart showing player performance data"

// Helper function to convert string to number safely
const parseNumber = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Type for chart data
interface ChartDataItem {
  rank: number
  player: string
  points: number
  assists: number
  rebounds: number
  steals: number
  blocks: number
  performance: number
  rankScore: number
}

export function ChartAreaInteractive() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState("avg_points")
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const performanceData = await fetchPlayerPerformance(20) // Get top 20 players
        
        // Transform data for chart
        const transformedData = performanceData
          .sort((a, b) => {
            const aValue = parseNumber(a[selectedMetric as keyof typeof a])
            const bValue = parseNumber(b[selectedMetric as keyof typeof b])
            return bValue - aValue
          })
          .slice(0, 10) // Top 10 players
          .map((player, index) => ({
            rank: index + 1,
            player: player.gamertag,
            points: parseNumber(player.avg_points),
            assists: parseNumber(player.avg_assists),
            rebounds: parseNumber(player.avg_rebounds),
            steals: parseNumber(player.avg_steals),
            blocks: parseNumber(player.avg_blocks),
            performance: parseNumber(player.avg_performance_score),
            rankScore: parseNumber(player.player_rank_score),
          }))

        setChartData(transformedData)
      } catch (error) {
        console.error('Error loading chart data:', error)
        // Fallback to sample data if API fails
        setChartData([
          { rank: 1, player: "Player 1", points: 25, assists: 8, rebounds: 10, steals: 2, blocks: 1, performance: 85, rankScore: 456 },
          { rank: 2, player: "Player 2", points: 22, assists: 10, rebounds: 8, steals: 3, blocks: 2, performance: 82, rankScore: 248 },
          { rank: 3, player: "Player 3", points: 20, assists: 6, rebounds: 12, steals: 1, blocks: 3, performance: 78, rankScore: 211 },
          { rank: 4, player: "Player 4", points: 18, assists: 9, rebounds: 7, steals: 2, blocks: 1, performance: 75, rankScore: 422 },
          { rank: 5, player: "Player 5", points: 16, assists: 7, rebounds: 9, steals: 1, blocks: 2, performance: 72, rankScore: 332 },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [selectedMetric, selectedPeriod])

  const metricLabels = {
    avg_points: "Points",
    avg_assists: "Assists", 
    avg_rebounds: "Rebounds",
    avg_steals: "Steals",
    avg_blocks: "Blocks",
    avg_performance_score: "Performance",
    player_rank_score: "Rank Score"
  }

  const getMetricValue = (data: ChartDataItem) => {
    switch (selectedMetric) {
      case "avg_points": return data.points
      case "avg_assists": return data.assists
      case "avg_rebounds": return data.rebounds
      case "avg_steals": return data.steals
      case "avg_blocks": return data.blocks
      case "avg_performance_score": return data.performance
      case "player_rank_score": return data.rankScore
      default: return data.points
    }
  }

  const chartConfig = {
    performance: {
      label: "Performance",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Player Performance</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Player Performance</CardTitle>
            <CardDescription>
              Top 10 players by {metricLabels[selectedMetric as keyof typeof metricLabels]}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avg_points">Points</SelectItem>
                <SelectItem value="avg_assists">Assists</SelectItem>
                <SelectItem value="avg_rebounds">Rebounds</SelectItem>
                <SelectItem value="avg_steals">Steals</SelectItem>
                <SelectItem value="avg_blocks">Blocks</SelectItem>
                <SelectItem value="avg_performance_score">Performance</SelectItem>
                <SelectItem value="player_rank_score">Rank Score</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              className="grid w-full grid-cols-3"
            >
              <ToggleGroupItem value="week" aria-label="Toggle week">
                Week
              </ToggleGroupItem>
              <ToggleGroupItem value="month" aria-label="Toggle month">
                Month
              </ToggleGroupItem>
              <ToggleGroupItem value="all" aria-label="Toggle all">
                All
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal
              vertical={false}
              className="stroke-muted"
            />
            <XAxis
              dataKey="player"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fontWeight: 500,
              }}
              tickMargin={10}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {payload[0].payload.player}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Rank #{payload[0].payload.rank}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">
                              {metricLabels[selectedMetric as keyof typeof metricLabels]}:
                            </span>
                            <span className="font-medium tabular-nums">
                              {getMetricValue(payload[0].payload).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ChartTooltipContent>
                  )
                }
                return null
              }}
            />
            <Area
              dataKey={selectedMetric === "avg_points" ? "points" : 
                       selectedMetric === "avg_assists" ? "assists" :
                       selectedMetric === "avg_rebounds" ? "rebounds" :
                       selectedMetric === "avg_steals" ? "steals" :
                       selectedMetric === "avg_blocks" ? "blocks" : 
                       selectedMetric === "player_rank_score" ? "rankScore" : "performance"}
              fill="url(#gradient)"
              className="fill-primary"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
