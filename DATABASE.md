# Database Schema Documentation

This document provides comprehensive documentation of the database schema for the Liturgy Faith application.

*Generated automatically - do not edit manually*

**Generated on:** Wed Jul  2 22:28:33 UTC 2025
**Method:** Supabase REST API

## Database Overview

This PostgreSQL database supports a liturgical management application with the following main components:

- **Authentication**: User management via Supabase Auth
- **Petitions**: Liturgical petition management with context templates
- **Settings**: User preferences and petition templates
- **Ministers**: Clergy and ministry team management
- **Liturgy Planning**: Liturgical calendar and planning tools
- **Readings**: Scripture reading management and collections

## Tables Overview

The following tables are available in the database:

## Table Schemas

### Table: `liturgical_readings`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | now() |
| `date` | date | YES | none |
| `first_reading` | text | YES | none |
| `gospel_reading` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `responsorial_psalm` | text | YES | none |
| `second_reading` | text | YES | none |
| `title` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `liturgy_plans`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `date` | date | YES | none |
| `description` | text | NO |  |
| `id` | uuid | NO | extensions.uuid_generate_v4() |
| `liturgical_readings_id` | uuid | YES | none |
| `note` | text | YES | none |
| `petitions_id` | uuid | YES | none |
| `title` | text | YES | none |
| `updated_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `user_id` | uuid | YES | none |

---

### Table: `ministers`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `availability` | jsonb | YES | none |
| `email` | text | YES | none |
| `id` | uuid | NO | extensions.uuid_generate_v4() |
| `name` | text | YES | none |
| `notes` | text | YES | none |
| `phone` | text | YES | none |
| `role` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `petition_contexts`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `context` | text | YES | none |
| `created_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `description` | text | YES | none |
| `id` | uuid | NO | extensions.uuid_generate_v4() |
| `title` | text | YES | none |
| `updated_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `user_id` | uuid | YES | none |

---

### Table: `petitions`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `context` | text | YES | none |
| `created_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `date` | date | YES | none |
| `generated_content` | text | YES | none |
| `id` | uuid | NO | extensions.uuid_generate_v4() |
| `language` | text | NO | english |
| `title` | text | YES | none |
| `updated_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `user_id` | uuid | YES | none |

---

### Table: `readings`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `categories` | jsonb | YES | none |
| `conclusion` | text | YES | none |
| `created_at` | timestamp with time zone | NO | now() |
| `id` | uuid | NO | gen_random_uuid() |
| `introduction` | text | YES | none |
| `language` | text | YES | none |
| `lectionary_id` | text | YES | none |
| `pericope` | text | YES | none |
| `text` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `translations`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | now() |
| `description` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `language` | text | YES | none |
| `name` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `user_settings`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `id` | uuid | NO | gen_random_uuid() |
| `language` | text | NO | en |
| `petition_definition` | text | YES | none |
| `petitions_definition` | text | NO | For the Church and her ministers... For those who serve in government... For the sick and suffering... For our parish community... For the faithful departed... |
| `updated_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |
| `user_id` | uuid | YES | none |

---

## Key Relationships

### Core Tables

- **petitions**: Main petition records with JSON context data
- **petition_contexts**: Reusable context templates for different liturgical occasions
- **petition_settings**: User-specific petition text templates

### User Management

- **user_settings**: User preferences and application settings
- All tables include `user_id` foreign keys to `auth.users`

### Ministry Management

- **ministers**: Clergy and ministry team information
- **liturgy_plans**: Liturgical planning and preparation

### Reading Management

- **reading_collections**: Named collections of scripture readings
- **individual_readings**: Individual scripture passages
- **reading_collection_items**: Many-to-many relationship between collections and readings

## Security

- All tables implement Row Level Security (RLS)
- Users can only access their own data via `user_id` filtering
- Policies enforce proper data isolation between users

## Data Types

- Primary keys: UUID with `uuid_generate_v4()` defaults
- Timestamps: `timestamp with time zone` using UTC
- JSON data: `jsonb` columns for flexible data storage
- Text fields: Various `text` columns for content

---

## Notes

- This documentation is automatically generated from the live database
- All tables use UUID primary keys with `uuid_generate_v4()` defaults
- Row Level Security (RLS) is enabled on user-facing tables
- Foreign key relationships enforce referential integrity
- Timestamps use `timezone('utc'::text, now())` for consistency

For more information about the database structure, see the migration files in `supabase/migrations/`.

