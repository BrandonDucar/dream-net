# DreamNet Admin Dashboard

The primary interface for observing and steering the DreamNet organism in real time.

## Overview

The Admin Dashboard provides a comprehensive view of DreamNet's internal state, consciousness, governance, and control systems. It connects to the Control Core API endpoints to display real-time data about the organism.

## Features

### Fully Wired Pages

- **Overview**: High-level organism status, organ health, mood, destiny alignment, and recent activity
- **Consciousness**: Attention focus, perception sources, reason decisions, reflex events, value trade-offs, and learning
- **Controls & Governance**: Divine Laws, Core Values, Constraints, Rights, and Balance Rules

### Stubbed Pages (Coming Soon)

- **Organs & Systems**: Detailed organ system monitoring
- **Agents & Workforces**: Agent activity and workforce management
- **Economy & Tokens**: Economic flows and token metrics
- **Events & Logs**: Event stream and system logs

## Getting Started

### Prerequisites

- Node.js >= 20.19.0 or >= 22.12.0
- pnpm >= 10.21.0
- DreamNet server running on `http://localhost:3000`

### Installation

From the monorepo root:

```bash
pnpm install
```

### Development

Start the Admin Dashboard development server:

```bash
pnpm dev:admin-dashboard
```

Or from the app directory:

```bash
cd apps/admin-dashboard
pnpm dev
```

The dashboard will be available at `http://localhost:5175`.

### Building

Build for production:

```bash
pnpm build:admin-dashboard
```

Or from the app directory:

```bash
cd apps/admin-dashboard
pnpm build
```

## Architecture

### File Structure

```
apps/admin-dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with navigation
│   │   └── ui/                 # UI components (Card, Badge, Tabs)
│   ├── pages/
│   │   ├── OverviewPage.tsx    # Overview (wired)
│   │   ├── ConsciousnessPage.tsx # Consciousness (wired)
│   │   ├── ControlsPage.tsx   # Governance (wired)
│   │   ├── OrgansPage.tsx      # Organs (stubbed)
│   │   ├── AgentsPage.tsx      # Agents (stubbed)
│   │   ├── EconomyPage.tsx     # Economy (stubbed)
│   │   └── EventsPage.tsx      # Events (stubbed)
│   ├── services/
│   │   └── api.ts              # API client
│   ├── types/
│   │   └── api.ts              # TypeScript types
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### API Integration

The dashboard connects to the Control Core API endpoints:

- `GET /api/admin/overview` - Overview snapshot
- `GET /api/admin/consciousness` - Consciousness snapshot
- `GET /api/admin/governance/laws` - Governance snapshot

All API calls use React Query (TanStack Query) for caching, refetching, and error handling.

### Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icons

## Extending the Dashboard

### Adding a New Page

1. Create a new page component in `src/pages/`:

```tsx
// src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">New Page</h2>
      {/* Your content */}
    </div>
  );
}
```

2. Add route in `src/App.tsx`:

```tsx
<Route path="/admin/new-page" element={<NewPage />} />
```

3. Add navigation item in `src/components/Layout.tsx`:

```tsx
{ name: "New Page", href: "/admin/new-page", icon: YourIcon },
```

### Adding API Integration

1. Add API function in `src/services/api.ts`:

```tsx
export async function fetchNewData(): Promise<NewDataType> {
  return fetchJSON<NewDataType>(`${API_BASE}/new-endpoint`);
}
```

2. Use in your page component:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["new-data"],
  queryFn: fetchNewData,
});
```

### Adding UI Components

Create reusable components in `src/components/ui/` following the existing patterns (Card, Badge, Tabs).

## Development Notes

- The dashboard runs on port 5175 by default
- API requests are proxied to `http://localhost:3000` via Vite proxy
- React Query automatically refetches data every 30 seconds
- All pages are responsive and work on desktop and tablet screens

## Troubleshooting

### API Connection Issues

If the dashboard can't connect to the API:

1. Ensure the DreamNet server is running on `http://localhost:3000`
2. Check the Vite proxy configuration in `vite.config.ts`
3. Verify CORS settings on the server

### Build Issues

If the build fails:

1. Run `pnpm install` from the monorepo root
2. Check TypeScript errors with `pnpm typecheck`
3. Ensure all dependencies are installed

## License

Part of the DreamNet monorepo. See root LICENSE file.

