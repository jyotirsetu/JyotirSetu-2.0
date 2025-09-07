-- JyotirSetu Admin Panel Database Setup
-- Run this SQL script in your Supabase SQL Editor

-- Create admin_credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for admin_credentials
DROP TRIGGER IF EXISTS update_admin_credentials_updated_at ON admin_credentials;
CREATE TRIGGER update_admin_credentials_updated_at 
    BEFORE UPDATE ON admin_credentials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_credentials
DROP POLICY IF EXISTS "Allow all operations for admin credentials" ON admin_credentials;
CREATE POLICY "Allow all operations for admin credentials" ON admin_credentials
FOR ALL USING (true);

-- Create policies for admin_sessions
DROP POLICY IF EXISTS "Allow all operations for admin sessions" ON admin_sessions;
CREATE POLICY "Allow all operations for admin sessions" ON admin_sessions
FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_credentials_username ON admin_credentials(username);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_session_id ON admin_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Insert default admin user (password: admin123)
-- Note: This will be hashed by the application
INSERT INTO admin_credentials (username, password_hash) 
VALUES ('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK')
ON CONFLICT (username) DO NOTHING;

-- Clean up expired sessions function
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired sessions (optional)
-- This would need to be set up in Supabase dashboard or via cron job
-- SELECT cron.schedule('cleanup-expired-sessions', '0 */6 * * *', 'SELECT cleanup_expired_sessions();');

COMMENT ON TABLE admin_credentials IS 'Stores admin user credentials with hashed passwords';
COMMENT ON TABLE admin_sessions IS 'Stores active admin sessions for authentication';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Removes expired sessions from the database';
