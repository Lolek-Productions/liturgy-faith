# Petitions App

A Next.js application for creating and managing church petitions, built with Supabase for authentication and database management.

## Features

- **User Authentication** - Secure login/signup with Supabase Auth
- **Petition Creation** - Guided form for creating petitions with context questions:
  - Sacraments received this week
  - Deaths this week
  - Sick community members
  - Special petitions
  - Language preference (English, Spanish, French, Latin)
- **Auto-Generated Content** - Formatted petition text based on traditional Catholic liturgy
- **Petition Management** - View, copy, and manage all created petitions
- **Responsive Design** - Clean, minimalistic UI with shadcn/ui components
- **Multi-User Support** - Each user has their own petitions with user_id isolation

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. A Supabase project created at [supabase.com](https://supabase.com)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Run database migrations:
   Apply the migration file in `supabase/migrations/001_initial_schema.sql` to your Supabase database via the Supabase dashboard SQL editor.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

- **petitions**: Main petition records with generated content
- **petition_templates**: Template data for petition generation (sacraments, deaths, sick members, special petitions)

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies enforce user_id isolation

## Testing

Run all tests with `npm test` or run a specific test file with `npm test filename` (e.g., `npm test invitation-flow`). Tests are written in Jest and located in `src/__tests__/`.

### Writing New Tests

When adding features, create test files in `src/__tests__/` following the pattern `feature-name.test.ts`. Mock external dependencies like Supabase and AWS SES, and test both success and error scenarios.

## Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Create Petition**: Fill out the guided form with community context
3. **Review Generated Content**: The app generates formatted petition text
4. **Copy for Use**: Copy the generated content for use in church services
5. **Manage Petitions**: View and manage all your created petitions

## Example Generated Petition

```
Petitions - June 28/29, 2025

For all bishops, the successors of the Apostles, may the Holy Spirit protect and guide them, let us pray to the Lord.
For government leaders, may God give them wisdom to work for justice and to protect the lives of the innocent, let us pray to the Lord.
For those who do not know Christ, may the Holy Spirit bring them to recognize his love and goodness, let us pray to the Lord.
For this community gathered here, may Christ grant us strength to proclaim him boldly, let us pray to the Lord.
For all those who are praying for healing, especially Joey Woods, Kenneth Thomas, Tom Allen, may they receive God's strength and grace, let us pray to the Lord.
For all who have died, especially Tim Alton, Audri Driscoll, may they rejoice with the angels and saints in the presence of God the Father, let us pray to the Lord.
For the intentions that we hold in the silence of our hearts (PAUSE 2-3 seconds), and for those written in our book of intentions, let us pray to the Lord.
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
