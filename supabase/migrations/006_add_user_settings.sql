-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr', 'la')),
    default_petition_type TEXT NOT NULL DEFAULT 'sunday' CHECK (default_petition_type IN ('daily', 'sunday', 'wedding', 'funeral')),
    auto_include_petitions BOOLEAN NOT NULL DEFAULT true,
    default_font_size TEXT NOT NULL DEFAULT 'medium' CHECK (default_font_size IN ('small', 'medium', 'large')),
    print_preferences JSONB NOT NULL DEFAULT '{
        "include_lector_names": true,
        "include_page_numbers": true,
        "margin_size": "medium"
    }'::jsonb,
    liturgical_preferences JSONB NOT NULL DEFAULT '{
        "preferred_translation": "NABRE",
        "show_pericope": true,
        "show_conclusion": true
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER on_user_settings_updated
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS user_settings_created_at_idx ON public.user_settings(created_at);
CREATE INDEX IF NOT EXISTS user_settings_updated_at_idx ON public.user_settings(updated_at);