-- Add donations_quick_amounts column to parish_settings table
ALTER TABLE parish_settings 
ADD COLUMN donations_quick_amounts jsonb DEFAULT '[{"amount": 500, "label": "$5"}, {"amount": 1000, "label": "$10"}, {"amount": 2500, "label": "$25"}, {"amount": 5000, "label": "$50"}]'::jsonb;

-- Add comment to document the column usage
COMMENT ON COLUMN parish_settings.donations_quick_amounts IS 'JSON array of quick amount options for general donations. Each object has "amount" (in cents) and "label" (display text). Default: $5, $10, $25, $50';

-- Update existing parish_settings records to include the default donations quick amounts
UPDATE parish_settings 
SET donations_quick_amounts = '[{"amount": 500, "label": "$5"}, {"amount": 1000, "label": "$10"}, {"amount": 2500, "label": "$25"}, {"amount": 5000, "label": "$50"}]'::jsonb
WHERE donations_quick_amounts IS NULL;