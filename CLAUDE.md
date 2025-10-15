# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based project management application built with TypeScript, Vite, and modern UI libraries. The app provides site management, task tracking, employee management, and authentication flows.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Type-check and build for production
npm run build

# Lint all files
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router v7 (with nested routes)
- **State Management**: Zustand (with persist + devtools middleware)
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

## Architecture

### Routing Structure

The app uses a hierarchical routing structure defined in `src/App.tsx`:

1. **Public Routes** (`/`):
   - Login flow: `/`, `/forgot-password`, `/confirm-email`, `/create-password`, `/create-profile`

2. **Protected Dashboard** (`/dashboard`):
   - Main layout renders `AppSidebar` + header with user info
   - Default redirects to `/dashboard/tasks`
   - Top-level routes: `tasks`, `requests`, `sites`, `employees`, `settings`

3. **Site Workspace** (`/dashboard/sites/:siteId`):
   - Uses `IndustryLayout` component with dedicated sidebar
   - Nested routes: `overview`, `members`, `tasks`, `inventory`, `chat`, `feedback`, `complain`, `work-pack`
   - Note: Dashboard padding is removed when inside Industry Workspace (`isIndustryWorkspace` check in Dashboard.tsx:46)

### State Management

- **Authentication State** (`src/store/authStore.ts`):
  - Zustand store with localStorage persistence
  - Handles: login, password reset flow, OTP verification, profile updates
  - Currently uses mock authentication (no real API calls)
  - Persists `user` and `isAuthenticated` to localStorage with key `auth-storage`

### Component Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui components (button, card, dialog, etc.)
│   ├── AppSidebar.tsx    # Main dashboard sidebar
│   └── ActiveMembers.tsx # Shared component
├── layout/
│   ├── IndustryLayout.tsx  # Site workspace layout with nav sidebar
│   └── AuthLayout.tsx      # (if exists)
├── pages/           # Route components (Dashboard, Sites, Tasks, etc.)
├── store/           # Zustand stores
├── hooks/           # Custom hooks (use-mobile.ts)
└── lib/             # Utilities (utils.ts with cn() helper)
```

### Path Aliases

The project uses `@/*` aliasing configured in both `tsconfig.json` and `vite.config.ts`:

```typescript
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"
```

### UI Components

Uses shadcn/ui components (New York style) configured via `components.json`. Components are installed in `src/components/ui/` and can be added using the shadcn CLI.

Key components include: sidebar, button, card, dialog, select, switch, table, tooltip, avatar, sheet, separator, sonner (toast notifications).

## Key Patterns

### Layout Nesting

- **Dashboard Layout**: Wraps authenticated routes, renders `AppSidebar` + header
- **Industry Layout**: Nested under dashboard for site-specific views (`/dashboard/sites/:siteId/*`)
- Check `isIndustryWorkspace` in Dashboard.tsx to conditionally remove padding

### Protected Routes

Dashboard checks `isAuthenticated` from `useAuthStore` and redirects to `/` if false (Dashboard.tsx:14-16).

### Mock Authentication

The `authStore` currently simulates API calls with `setTimeout` delays. Look for console logs prefixed with emoji (🔐, ✅, etc.) for debugging auth flows.

## Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Uses CSS variables for theming (configured in `src/index.css`)
- `next-themes` package for dark mode support (though implementation may be incomplete)
- Utility function `cn()` from `lib/utils.ts` for conditional classes (uses `clsx` + `tailwind-merge`)

## Important Notes

- Always use the `@/` path alias for imports
- The app is currently in development with mock data/authentication
- Two modified files tracked by git: `src/layout/IndustryLayout.tsx` and `src/pages/Dashboard.tsx`
- When working with nested routes, remember that Industry Layout routes are relative to `/dashboard/sites/:siteId/`
