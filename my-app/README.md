# Bodega Cats GC League Dashboard

A Next.js dashboard for managing and viewing esports tournament data, now powered by the ts-backend API.

## Features

- **Real-time Data**: Live player performance statistics
- **Interactive Charts**: Visualize player performance trends
- **Data Tables**: Sortable and filterable player data
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Radix UI and Tailwind CSS

## Migration from Supabase

This dashboard has been migrated from direct Supabase database access to use the ts-backend API. This provides:

- **Better Architecture**: Separation between frontend and database
- **Centralized Logic**: All business logic in the backend
- **Better Security**: Row Level Security handled server-side
- **Easier Testing**: Can mock API responses
- **Better Performance**: Optimized queries in backend

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Supabase Configuration (for authentication if needed)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Update the API base URL to point to your ts-backend instance

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Navigate to `http://localhost:3000`

## API Endpoints Used

The dashboard uses these ts-backend API endpoints:

- `/api/health` - Health check
- `/api/views/player-performance` - Player performance data
- `/api/players` - Player information
- `/api/teams` - Team information
- `/api/events` - Event information

## Components

### SectionCards
Displays key statistics:
- Total Events
- Total Players
- Total Teams
- Average Performance Score

### ChartAreaInteractive
Shows player performance trends with:
- Interactive metric selection (Points, Assists, Rebounds, etc.)
- Top 10 players visualization
- Real-time data updates

### DataTable
Comprehensive player data table with:
- Sortable columns
- Search functionality
- Pagination
- Column visibility controls

## Development

### Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard page
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── ui/               # UI components
│   ├── data-table.tsx    # Data table component
│   ├── chart-area-interactive.tsx
│   └── section-cards.tsx
├── lib/                  # Utility libraries
│   ├── api/              # API client and queries
│   │   ├── client.ts     # API client
│   │   └── queries.ts    # API query functions
│   └── env.ts            # Environment variables
└── types/                # TypeScript type definitions
```

### Adding New Features

1. **New API Endpoints**: Add query functions in `lib/api/queries.ts`
2. **New Components**: Create components in the `components/` directory
3. **New Pages**: Add pages in the `app/` directory

## Troubleshooting

### API Connection Issues

1. **Check API URL**: Ensure `NEXT_PUBLIC_API_BASE_URL` is correct
2. **Verify Backend**: Make sure ts-backend is running on the specified port
3. **Check CORS**: Ensure the backend allows requests from your frontend domain

### Data Loading Issues

1. **Check Network Tab**: Look for failed API requests
2. **Verify Endpoints**: Ensure the API endpoints exist and are working
3. **Check Authentication**: Some endpoints may require authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
