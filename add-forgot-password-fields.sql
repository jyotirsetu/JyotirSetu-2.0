-- Add forgot password fields to admin_credentials table
-- Run this SQL script in your Supabase SQL Editor

-- Add reset token fields to admin_credentials table
ALTER TABLE admin_credentials 
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add index for reset token lookup
CREATE INDEX IF NOT EXISTS idx_admin_credentials_reset_token 
ON admin_credentials(reset_token);

-- Update existing admin user with email (replace with your actual email)
UPDATE admin_credentials 
SET email = 'admin@jyotirsetu.com' 
WHERE username = 'admin' AND email IS NULL;

-- Add comments for the new fields
COMMENT ON COLUMN admin_credentials.reset_token IS 'Temporary token for password reset';
COMMENT ON COLUMN admin_credentials.reset_token_expires IS 'Expiration time for reset token';
COMMENT ON COLUMN admin_credentials.email IS 'Admin email for password reset notifications';
