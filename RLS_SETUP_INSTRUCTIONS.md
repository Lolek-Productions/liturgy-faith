# RLS Parish Filtering Setup Instructions

This document provides step-by-step instructions for setting up the Row Level Security (RLS) policies that enable automatic parish filtering based on JWT claims.

## Overview

The system works by:
1. Users select their parish in `user_settings.selected_parish_id`
2. JWT claims are automatically updated with the selected parish ID
3. RLS policies use the JWT claims to filter all data automatically
4. No explicit parish filtering is needed in application code

## Migration Files Created

1. **`002_rls_parish_filtering.sql`** - Creates RLS policies for all parish-based tables
2. **`003_jwt_claims_functions.sql`** - Creates functions to manage JWT custom claims

## Setup Steps

### 1. Apply the Migrations

Run the migrations in your Supabase project:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard > SQL Editor
```

### 2. Verify RLS Policies

Check that RLS is enabled and policies are created:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 3. Test the System

#### A. Create Test Data

```sql
-- Create a test parish
INSERT INTO parishes (id, name, city, state) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Test Parish', 'Test City', 'TS');

-- Create a test user-parish association
INSERT INTO parish_user (user_id, parish_id, roles) 
VALUES (auth.uid(), '550e8400-e29b-41d4-a716-446655440000', '["admin"]');

-- Set the selected parish in user settings
INSERT INTO user_settings (user_id, selected_parish_id, language) 
VALUES (auth.uid(), '550e8400-e29b-41d4-a716-446655440000', 'en')
ON CONFLICT (user_id) 
DO UPDATE SET selected_parish_id = '550e8400-e29b-41d4-a716-446655440000';
```

#### B. Test RLS Filtering

```sql
-- Test the helper functions
SELECT get_selected_parish_id(); -- Should return your parish ID
SELECT user_has_parish_access('550e8400-e29b-41d4-a716-446655440000'); -- Should return true

-- Test data access (should only show data for your parish)
SELECT * FROM petitions; -- Should only show petitions for your parish
SELECT * FROM categories; -- Should only show categories for your parish
```

## How It Works

### 1. JWT Claims Update

When a user changes their selected parish:

```typescript
// In your application code
await setSelectedParish(parishId)
// This automatically updates JWT claims via database trigger
```

### 2. Automatic Filtering

All queries are automatically filtered:

```typescript
// Your application code - no explicit filtering needed
const petitions = await supabase.from('petitions').select('*')
// RLS automatically filters to only show petitions for selected parish
```

### 3. Security

- Users can only access parishes they're associated with in `parish_user` table
- All data is filtered by the selected parish from JWT claims
- No explicit parish filtering needed in application code

## Key Functions

### `get_selected_parish_id()`
Returns the selected parish ID from JWT claims.

### `user_has_parish_access(parish_id)`
Checks if the current user has access to the specified parish.

### `update_user_claims(claims)`
Updates the JWT custom claims for the current user.

## Table-Specific Notes

### Standard Tables
Most tables use `parish_id` field and follow the standard pattern:
- `categories`, `groups`, `liturgical_event_templates`, `liturgical_events`
- `liturgical_readings`, `ministers`, `people`, `petition_contexts`
- `petitions`, `reading_categories`, `readings`, `translations`

### Special Cases

#### `ministries` Table
Uses `parish` field instead of `parish_id` (database inconsistency).

#### Joining Tables
Tables without direct parish_id use subqueries:
- `group_members` - filtered through `groups.parish_id`
- `event_ministry_assignments` - filtered through `liturgical_events.parish_id`
- `event_role_assignments` - filtered through event relationships

#### User-Specific Tables
Some tables remain user-specific:
- `user_settings` - personal user settings
- `parish_user` - user-parish associations

## Troubleshooting

### Common Issues

1. **RLS policies not working**
   - Check that RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
   - Verify policies exist: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`

2. **JWT claims not updating**
   - Check the trigger is created: `SELECT * FROM pg_trigger WHERE tgname = 'update_jwt_claims_on_parish_change';`
   - Verify the function exists: `SELECT * FROM pg_proc WHERE proname = 'update_user_claims';`

3. **No data showing**
   - Check user has parish association: `SELECT * FROM parish_user WHERE user_id = auth.uid();`
   - Verify selected parish is set: `SELECT * FROM user_settings WHERE user_id = auth.uid();`
   - Test the helper functions: `SELECT get_selected_parish_id(), user_has_parish_access(get_selected_parish_id());`

### Debug Queries

```sql
-- Check current user and claims
SELECT auth.uid(), get_selected_parish_id(), get_user_claims();

-- Check user's parish associations
SELECT * FROM parish_user WHERE user_id = auth.uid();

-- Check user settings
SELECT * FROM user_settings WHERE user_id = auth.uid();

-- Test RLS function
SELECT user_has_parish_access(get_selected_parish_id());
```

## Next Steps

After setting up RLS:

1. **Test the application** - All queries should automatically filter by parish
2. **Create parish selection UI** - Allow users to switch between parishes
3. **Add localStorage persistence** - Remember selected parish in browser
4. **Test with multiple parishes** - Verify isolation works correctly

The RLS system is now ready and will automatically filter all data based on the user's selected parish!