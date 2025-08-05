# Migration Guide: Supabase to ts-backend API

This guide explains how to migrate from direct Supabase database access to using the ts-backend API.

## Environment Variables

Update your `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Keep Supabase for authentication (if needed)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Changes

### 1. API Client

- **Old**: Direct Supabase client queries
- **New**: REST API calls via `apiClient`

### 2. Data Fetching

- **Old**: `supabase.from('table').select()`
- **New**: `apiClient.get('/endpoint')`

### 3. Authentication

- **Old**: Supabase Auth
- **New**: JWT tokens from Supabase Auth (if needed)

## Migration Steps

1. **Update environment variables** to include `NEXT_PUBLIC_API_BASE_URL`
2. **Replace Supabase queries** with API calls
3. **Update components** to use new data structure
4. **Test all functionality** to ensure compatibility

## API Endpoints

The ts-backend provides these main endpoints:

- `/api/health` - Health check
- `/api/players` - Player data
- `/api/teams` - Team data
- `/api/events` - Event data
- `/api/matches` - Match data
- `/api/views/*` - Database views (performance data)
- `/api/search` - Search functionality

## Benefits

- **Better separation of concerns** - Frontend doesn't need database access
- **Centralized business logic** - All data processing in backend
- **Better security** - Row Level Security handled in backend
- **Easier testing** - Mock API responses instead of database
- **Better performance** - Optimized queries in backend
