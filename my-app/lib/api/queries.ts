import { apiClient } from './client'

// Types based on actual API response structure
export interface Player {
  id: string
  gamertag: string
  position: string | null
  current_team_id: string | null
  team_name: string | null
  player_rp: number
  player_rank_score: number
  salary_tier: string | null
  monthly_value: number
  created_at: string
  updated_at: string
}

export interface PlayerPerformance {
  id: string
  gamertag: string
  position: string | null
  current_team_id: string | null
  team_name: string | null
  player_rp: number
  player_rank_score: number
  salary_tier: string | null
  monthly_value: number
  games_played: string
  avg_points: string
  avg_assists: string
  avg_rebounds: string
  avg_steals: string
  avg_blocks: string
  avg_performance_score: number
}

export interface Team {
  id: string
  name: string
  region: string | null
  created_at: string
  updated_at: string
}

export interface TeamPerformance {
  team_id: string
  team_name: string
  total_matches: number
  total_wins: number
  total_losses: number
  win_percentage: number
  points_scored: number
  points_allowed: number
  average_points_scored: number
}

export interface Event {
  id: string
  name: string
  start_date: string
  end_date: string
  type: string
  location: string | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  event_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  status: string
  venue: string | null
  created_at: string
  updated_at: string
}

export interface MatchDetails {
  id: string
  event_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  status: string
  venue: string | null
  home_team_name: string
  away_team_name: string
  home_score: number
  away_score: number
  created_at: string
  updated_at: string
}

// Player queries
export async function fetchPlayers(limit = 10): Promise<Player[]> {
  const response = await apiClient.get<Player[]>(`/players?limit=${limit}`)
  return response.data || []
}

export async function fetchPlayerById(id: string): Promise<Player | null> {
  const response = await apiClient.get<Player>(`/players/${id}`)
  return response.data || null
}

export async function fetchPlayerPerformance(limit = 10): Promise<PlayerPerformance[]> {
  const response = await apiClient.get<{ data: PlayerPerformance[] }>(`/views/player-performance?limit=${limit}`)
  return response.data?.data || []
}

export async function fetchPlayerPerformanceById(playerId: string): Promise<PlayerPerformance | null> {
  const response = await apiClient.get<PlayerPerformance>(`/views/player-performance-view/${playerId}`)
  return response.data || null
}

// Team queries
export async function fetchTeams(): Promise<Team[]> {
  const response = await apiClient.get<Team[]>('/teams')
  return response.data || []
}

export async function fetchTeamById(id: string): Promise<Team | null> {
  const response = await apiClient.get<Team>(`/teams/${id}`)
  return response.data || null
}

export async function fetchTeamPerformance(): Promise<TeamPerformance[]> {
  const response = await apiClient.get<TeamPerformance[]>('/views/team-performance')
  return response.data || []
}

export async function fetchTeamPerformanceById(teamId: string): Promise<TeamPerformance | null> {
  const response = await apiClient.get<TeamPerformance>(`/views/team-performance-summary/${teamId}`)
  return response.data || null
}

// Event queries
export async function fetchEvents(limit = 10): Promise<Event[]> {
  const response = await apiClient.get<Event[]>(`/events?limit=${limit}`)
  return response.data || []
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const response = await apiClient.get<Event>(`/events/${id}`)
  return response.data || null
}

export async function fetchUpcomingEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>('/views/upcoming-events')
  return response.data || []
}

// Match queries
export async function fetchMatches(): Promise<Match[]> {
  const response = await apiClient.get<Match[]>('/matches')
  return response.data || []
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  const response = await apiClient.get<Match>(`/matches/${id}`)
  return response.data || null
}

export async function fetchUpcomingMatches(): Promise<Match[]> {
  const response = await apiClient.get<Match[]>('/views/upcoming-matches')
  return response.data || []
}

export async function fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
  const response = await apiClient.get<MatchDetails>(`/views/match-details/${matchId}`)
  return response.data || null
}

// Search queries
export async function searchData(query: string): Promise<{
  players: Player[]
  teams: Team[]
}> {
  const response = await apiClient.get<{
    players: Player[]
    teams: Team[]
  }>(`/search?q=${encodeURIComponent(query)}`)
  return response.data || { players: [], teams: [] }
}

// Health check
export async function checkApiHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await apiClient.get<{ status: string; timestamp: string }>('/health')
  return response.data || { status: 'error', timestamp: new Date().toISOString() }
} 