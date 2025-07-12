-- Add user display information to existing user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Clean up duplicate user_settings entries and add unique constraint
DO $$
BEGIN
  -- First, remove duplicate user_settings (keep the most recent one for each user_id)
  DELETE FROM public.user_settings 
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM public.user_settings
    ORDER BY user_id, updated_at DESC
  );

  -- Add unique constraint on user_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_settings_user_id_key'
  ) THEN
    ALTER TABLE public.user_settings 
    ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_user_settings_full_name ON public.user_settings(full_name);

-- Add policy for parish admins to view user settings of their parish members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Parish admins can view member settings'
  ) THEN
    CREATE POLICY "Parish admins can view member settings" ON public.user_settings
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.parish_user pu1
          JOIN public.parish_user pu2 ON pu1.parish_id = pu2.parish_id
          WHERE pu1.user_id = auth.uid()
            AND pu1.roles @> '["admin"]'::jsonb
            AND pu2.user_id = user_settings.user_id
        )
      );
  END IF;
END $$;

-- Function to automatically create user settings with profile info on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, full_name, language)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    'en'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(user_settings.full_name, EXCLUDED.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user settings when auth.users is updated (only if metadata changes)
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if user_metadata has changed and we don't already have a full_name
  UPDATE public.user_settings
  SET 
    full_name = COALESCE(
      user_settings.full_name,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    updated_at = NOW()
  WHERE user_id = NEW.id 
    AND (user_settings.full_name IS NULL OR user_settings.full_name = '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();