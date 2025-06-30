# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Development server**: `npm run dev` (runs with Turbopack for faster builds)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Lint**: `npm run lint`

## Architecture Overview

This is a Next.js 15 application using the App Router for managing church petitions with Supabase backend.

### Core Structure

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth)
- **Authentication**: Supabase Auth with server-side session management
- **Data Layer**: Server Actions in `/src/lib/actions/petitions.ts`

### Route Organization

**Two-tier layout system:**
- **Root layout** (`/src/app/layout.tsx`): No sidebar, minimal layout for public pages
- **Main app layout** (`/src/app/(main)/layout.tsx`): Includes sidebar for authenticated app pages

**Route structure:**
- `/` - Marketing landing page (no sidebar)
- `/login`, `/signup` - Auth pages (no sidebar)
- `/(main)/dashboard` - Main dashboard with stats and quick actions
- `/(main)/petitions` - List all user petitions (index page)
- `/(main)/petitions/create` - Create new petition form
- `/(main)/petitions/[id]` - View individual petition details
- `/(main)/settings` - App settings

### Authentication Flow

Supabase Auth with middleware protection pattern:
- Public pages: `/`, `/login`, `/signup` accessible without auth
- All `(main)` routes protected by middleware in `middleware.ts`
- Server client (`/src/lib/supabase/server.ts`) for server-side operations (async function)
- Browser client (`/src/lib/supabase/client.ts`) for client-side operations
- Middleware handles session refresh and redirects unauthenticated users to `/login`

### Next.js 15 Compatibility Notes

**Important patterns for this codebase:**
- Server client is async: `const supabase = await createClient()`
- Route params are promises: `const { id } = await params`
- Cookies API is async: `const cookieStore = await cookies()`

### Database Schema

Two main tables with RLS policies:
- `petitions`: Main petition records with generated liturgical content
- `petition_contexts`: Associated context data (arrays stored as JSONB)

User isolation enforced through `user_id` foreign keys and RLS policies.

### Petition Generation Logic

Core business logic in `/src/lib/actions/petitions.ts`:
- Takes liturgical context (sacraments, deaths, sick members, special requests)
- Generates formatted petition text based on traditional Catholic liturgy
- Supports multiple languages (English, Spanish, French, Latin)
- Auto-formats with proper liturgical structure and pauses

### Component Architecture

- Uses shadcn/ui component library with Radix UI primitives
- Sidebar navigation with `AppSidebar` component shows main app navigation
- `MainHeader` component with sidebar toggle and breadcrumb navigation
- Marketing page has its own navigation header with auth buttons
- Form handling with react-hook-form and Zod validation
- Server components used where possible for better performance

### Navigation Components

- **MainHeader**: Includes sidebar toggle button and breadcrumb system with default "Dashboard" breadcrumb
- **AppSidebar**: Clickable header with Church icon linking to dashboard, plus navigation menu for all main routes
- **Breadcrumb**: Flexible breadcrumb component following shadcn/ui patterns for page navigation context

### Environment Setup

Requires Supabase project with environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY` (for future AI features)

Database must be initialized with the migration in `/supabase/migrations/001_initial_schema.sql`.

### Key Implementation Details

- Email confirmation is disabled in Supabase for immediate user access
- Signup flow automatically signs users in after account creation
- Dashboard page includes auth check with redirect to `/login` if needed
- All petition data operations use server actions for security