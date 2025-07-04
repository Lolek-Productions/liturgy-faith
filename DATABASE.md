# Database Schema Documentation

This document provides comprehensive documentation of the database schema for the Liturgy Faith application.

*Generated automatically - do not edit manually*

**Generated on:** Thu Jul  3 18:21:36 UTC 2025
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

### Table: `categories`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | now() |
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `event_ministry_assignments`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `event_id` | uuid | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `ministry_id` | uuid | YES | none |

---

### Table: `event_role_assignments`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `confirmed` | boolean | YES | none |
| `created_at` | timestamp with time zone | NO | now() |
| `event_ministry_assignment_id` | uuid | YES | none |
| `group_id` | uuid | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `person_id` | uuid | YES | none |
| `role_notes` | text | YES | none |
| `updated_at` | timestamp with time zone | NO | now() |

---

### Table: `group_members`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `group_id` | uuid | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `joined_at` | timestamp with time zone | NO | now() |
| `person_id` | uuid | YES | none |
| `role` | text | YES | none |

---

### Table: `groups`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `description` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `liturgical_event_templates`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `description` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | YES | none |
| `template_data` | jsonb | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `liturgical_events`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | now() |
| `description` | text | YES | none |
| `end_time` | time without time zone | YES | none |
| `event_date` | date | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `liturgical_readings_id` | uuid | YES | none |
| `location` | text | YES | none |
| `name` | text | YES | none |
| `notes` | text | YES | none |
| `petitions_id` | uuid | YES | none |
| `start_time` | time without time zone | YES | none |
| `status` | text | NO | draft |
| `template_id` | uuid | YES | none |
| `updated_at` | timestamp with time zone | NO | now() |
| `user_id` | uuid | YES | none |

---

### Table: `liturgical_readings`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `created_at` | timestamp with time zone | NO | now() |
| `date` | date | YES | none |
| `description` | text | YES | none |
| `first_reading_lector` | text | YES | none |
| `first_reading` | text | YES | none |
| `gospel_lector` | text | YES | none |
| `gospel_reading` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `psalm_lector` | text | YES | none |
| `responsorial_psalm` | text | YES | none |
| `second_reading_lector` | text | YES | none |
| `second_reading` | text | YES | none |
| `title` | text | YES | none |
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

### Table: `ministries`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `description` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | YES | none |
| `requirements` | text | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `parish_user`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `parish_id` | uuid | YES | none |
| `roles` | jsonb | YES | none |
| `user_id` | uuid | YES | none |

---

### Table: `parishes`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `city` | text | YES | none |
| `created_at` | timestamp with time zone | NO | now() |
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | YES | none |
| `state` | text | YES | none |

---

### Table: `people`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `email` | text | YES | none |
| `first_name` | text | YES | none |
| `id` | uuid | NO | gen_random_uuid() |
| `last_name` | text | YES | none |
| `notes` | text | YES | none |
| `phone` | text | YES | none |
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

### Table: `reading_categories`

**Column Schema:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `category_id` | uuid | YES | none |
| `created_at` | timestamp with time zone | NO | now() |
| `id` | uuid | NO | gen_random_uuid() |
| `reading_id` | uuid | YES | none |

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
| `reading_category_ids` | jsonb | YES | none |
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

