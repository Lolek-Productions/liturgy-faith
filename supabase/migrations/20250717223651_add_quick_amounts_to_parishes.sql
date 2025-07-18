-- Create parish_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS parish_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id uuid NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(parish_id)
);

-- Add RLS policy for parish_settings
ALTER TABLE parish_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access settings for parishes they belong to
CREATE POLICY "Users can access parish settings for their parishes" ON parish_settings
    FOR ALL USING (
        parish_id IN (
            SELECT parish_id 
            FROM parish_user 
            WHERE user_id = auth.uid()
        )
    );

-- Add mass_intention_offering_quick_amounts column to parish_settings table
ALTER TABLE parish_settings 
ADD COLUMN mass_intention_offering_quick_amounts jsonb DEFAULT '[{"amount": 100, "label": "$1"}, {"amount": 200, "label": "$2"}, {"amount": 500, "label": "$5"}]'::jsonb;

-- Add comment to document the column usage
COMMENT ON COLUMN parish_settings.mass_intention_offering_quick_amounts IS 'JSON array of quick amount options for Mass Intentions. Each object has "amount" (in cents) and "label" (display text). Default: $1, $2, $5';

-- Insert default settings for existing parishes
INSERT INTO parish_settings (parish_id)
SELECT id FROM parishes 
WHERE NOT EXISTS (
    SELECT 1 FROM parish_settings WHERE parish_id = parishes.id
);