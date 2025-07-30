-- Add default_petitions field to parish_settings table
ALTER TABLE public.parish_settings 
ADD COLUMN IF NOT EXISTS default_petitions text;

-- Add comment to describe the column
COMMENT ON COLUMN public.parish_settings.default_petitions IS 'Default petition text that will be used when no template-specific petitions are defined';