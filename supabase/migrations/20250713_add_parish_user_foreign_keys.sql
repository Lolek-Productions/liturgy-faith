-- Add foreign key constraints to ensure data integrity
-- This migration adds proper foreign key relationships for the parish_user table

-- Add foreign key from parish_user.user_id to auth.users.id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'parish_user_user_id_fkey'
  ) THEN
    ALTER TABLE public.parish_user
    ADD CONSTRAINT parish_user_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key from parish_user.parish_id to parishes.id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'parish_user_parish_id_fkey'
  ) THEN
    ALTER TABLE public.parish_user
    ADD CONSTRAINT parish_user_parish_id_fkey 
    FOREIGN KEY (parish_id) 
    REFERENCES public.parishes(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key from user_settings.user_id to auth.users.id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_settings_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Create a view to make joining parish_user with user_settings easier
CREATE OR REPLACE VIEW public.parish_members_view AS
SELECT 
  pu.parish_id,
  pu.user_id,
  pu.roles,
  us.full_name,
  us.avatar_url,
  us.created_at,
  us.updated_at
FROM public.parish_user pu
INNER JOIN public.user_settings us ON pu.user_id = us.user_id;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.parish_members_view TO authenticated;

-- Add RLS policy for the view (views inherit from base tables)
-- The view will automatically respect the RLS policies of the underlying tables