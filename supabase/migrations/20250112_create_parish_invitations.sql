-- Create parish_invitations table
CREATE TABLE IF NOT EXISTS public.parish_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  roles JSONB DEFAULT '["member"]'::jsonb,
  invited_by UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Ensure email is lowercase and trimmed
  CONSTRAINT email_format CHECK (email = LOWER(TRIM(email)))
);

-- Create indexes
CREATE INDEX idx_parish_invitations_token ON public.parish_invitations(token);
CREATE INDEX idx_parish_invitations_email ON public.parish_invitations(email);
CREATE INDEX idx_parish_invitations_parish_id ON public.parish_invitations(parish_id);
CREATE INDEX idx_parish_invitations_expires_at ON public.parish_invitations(expires_at);

-- Enable RLS
ALTER TABLE public.parish_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Parish admins can view invitations for their parish
CREATE POLICY "Parish admins can view invitations" ON public.parish_invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parish_user
      WHERE parish_user.parish_id = parish_invitations.parish_id
        AND parish_user.user_id = auth.uid()
        AND parish_user.roles @> '["admin"]'::jsonb
    )
  );

-- Parish admins can create invitations
CREATE POLICY "Parish admins can create invitations" ON public.parish_invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parish_user
      WHERE parish_user.parish_id = parish_invitations.parish_id
        AND parish_user.user_id = auth.uid()
        AND parish_user.roles @> '["admin"]'::jsonb
    )
    AND invited_by = auth.uid()
  );

-- Parish admins can delete their parish invitations
CREATE POLICY "Parish admins can delete invitations" ON public.parish_invitations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.parish_user
      WHERE parish_user.parish_id = parish_invitations.parish_id
        AND parish_user.user_id = auth.uid()
        AND parish_user.roles @> '["admin"]'::jsonb
    )
  );

-- Anyone can read an invitation by token (for accepting invitations)
CREATE POLICY "Anyone can read invitation by token" ON public.parish_invitations
  FOR SELECT
  USING (true);

-- Function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
  DELETE FROM public.parish_invitations
  WHERE expires_at < NOW() AND accepted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;