# Testing Action Files with Parish Filtering

This document provides test steps to verify that all action files are working correctly with the new parish filtering system.

## Pre-requisites

1. ✅ RLS migrations have been applied
2. ✅ User has a parish association in `parish_user` table
3. ✅ User has `selected_parish_id` set in `user_settings`

## Test Setup

First, ensure you have test data:

```sql
-- Create a test parish (if not exists)
INSERT INTO parishes (id, name, city, state) 
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Test Parish', 'Test City', 'TS')
ON CONFLICT (id) DO NOTHING;

-- Associate current user with parish
INSERT INTO parish_user (user_id, parish_id, roles) 
VALUES (auth.uid(), '550e8400-e29b-41d4-a716-446655440001', '["admin"]')
ON CONFLICT (user_id, parish_id) DO NOTHING;

-- Set selected parish in user settings
INSERT INTO user_settings (user_id, selected_parish_id, language) 
VALUES (auth.uid(), '550e8400-e29b-41d4-a716-446655440001', 'en')
ON CONFLICT (user_id) 
DO UPDATE SET selected_parish_id = '550e8400-e29b-41d4-a716-446655440001';
```

## Test Action Files

### 1. Test Petitions

```typescript
// Test creating a petition
import { createPetition } from '@/lib/actions/petitions';

const testPetition = await createPetition({
  title: 'Test Petition',
  date: '2025-01-15',
  language: 'english',
  community_info: 'Test community info'
});

// Test getting petitions
import { getPetitions } from '@/lib/actions/petitions';
const petitions = await getPetitions();
console.log('Petitions:', petitions);
```

### 2. Test Categories

```typescript
// Test creating a category
import { createCategory } from '@/lib/actions/categories';

const testCategory = await createCategory({
  name: 'Test Category',
  description: 'Test description'
});

// Test getting categories
import { getCategories } from '@/lib/actions/categories';
const categories = await getCategories();
console.log('Categories:', categories);
```

### 3. Test Groups

```typescript
// Test creating a group
import { createGroup } from '@/lib/actions/groups';

const testGroup = await createGroup({
  name: 'Test Group',
  description: 'Test description'
});

// Test getting groups
import { getGroups } from '@/lib/actions/groups';
const groups = await getGroups();
console.log('Groups:', groups);
```

### 4. Test People

```typescript
// Test creating a person
import { createPerson } from '@/lib/actions/people';

const testPerson = await createPerson({
  first_name: 'Test',
  last_name: 'Person',
  email: 'test@example.com'
});

// Test getting people
import { getPeople } from '@/lib/actions/people';
const people = await getPeople();
console.log('People:', people);
```

### 5. Test Ministers

```typescript
// Test creating a minister
import { createMinister } from '@/lib/actions/ministers';

const testMinister = await createMinister({
  name: 'Test Minister',
  role: 'Priest',
  email: 'minister@example.com'
});

// Test getting ministers
import { getMinisters } from '@/lib/actions/ministers';
const ministers = await getMinisters();
console.log('Ministers:', ministers);
```

## Verification Checklist

For each action file test:

- [ ] **Create operation**: Creates data with correct `parish_id`
- [ ] **Read operation**: Only returns data for selected parish
- [ ] **Update operation**: Only updates data for selected parish
- [ ] **Delete operation**: Only deletes data for selected parish
- [ ] **No explicit parish filtering**: Code doesn't contain `.eq('parish_id', ...)`
- [ ] **RLS works**: Data is automatically filtered by database

## Common Issues & Solutions

### 1. "No parish selected" error
**Problem**: User doesn't have `selected_parish_id` set
**Solution**: 
```sql
UPDATE user_settings 
SET selected_parish_id = 'your-parish-id' 
WHERE user_id = auth.uid();
```

### 2. "User not authenticated" error
**Problem**: JWT claims not set properly
**Solution**: 
```sql
SELECT update_user_claims(jsonb_build_object('selected_parish_id', 'your-parish-id'));
```

### 3. RLS blocking all access
**Problem**: RLS policies too restrictive
**Solution**: Check user has parish association:
```sql
SELECT * FROM parish_user WHERE user_id = auth.uid();
```

### 4. Data not showing up
**Problem**: Looking for wrong parish data
**Solution**: Verify selected parish:
```sql
SELECT get_selected_parish_id();
```

## Database Verification

Run these queries to verify the system is working:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('petitions', 'categories', 'groups');

-- Check JWT claims
SELECT get_user_claims();

-- Check helper functions
SELECT get_selected_parish_id();
SELECT user_has_parish_access(get_selected_parish_id());

-- Test data access
SELECT COUNT(*) FROM petitions;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM groups;
```

## Success Criteria

✅ All action files work without modification
✅ Data is automatically filtered by parish
✅ Create operations set correct parish_id
✅ No explicit parish filtering in code
✅ RLS policies handle security
✅ JWT claims update automatically

If all tests pass, your parish filtering system is working correctly!