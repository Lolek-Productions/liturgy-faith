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

### Key Directories

- `/src/app/`: Next.js App Router pages and layouts
- `/src/components/`: Reusable UI components (uses shadcn/ui)
- `/src/lib/`: Utilities, types, and server actions
- `/src/lib/supabase/`: Supabase client configurations (browser, server, middleware)
- `/supabase/migrations/`: Database schema migrations

### Authentication Flow

The app uses Supabase Auth with middleware protection:
- Middleware in `middleware.ts` handles session refresh
- Server client in `/src/lib/supabase/server.ts` for server-side operations
- Browser client in `/src/lib/supabase/client.ts` for client-side operations
- All data access enforced through Row Level Security (RLS) policies

### Database Schema

Two main tables with RLS policies:
- `petitions`: Main petition records with generated liturgical content
- `petition_contexts`: Associated context data (arrays stored as JSONB)

Both tables enforce user isolation through `user_id` foreign keys.

### Petition Generation Logic

Core business logic in `/src/lib/actions/petitions.ts`:
- Takes liturgical context (sacraments, deaths, sick members, special requests)
- Generates formatted petition text based on traditional Catholic liturgy
- Supports multiple languages (English, Spanish)
- Auto-formats with proper liturgical structure and pauses

### Component Architecture

- Uses shadcn/ui component library with Radix UI primitives
- Sidebar navigation with `AppSidebar` component
- Form handling with react-hook-form and Zod validation
- Uses server components where possible for better performance

### Environment Setup

Requires Supabase project with environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Database must be initialized with the migration in `/supabase/migrations/001_initial_schema.sql`.