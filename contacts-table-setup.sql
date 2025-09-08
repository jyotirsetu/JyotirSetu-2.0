-- =============================================
-- CONTACTS TABLE SETUP ONLY
-- =============================================

-- 1. CREATE CONTACTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE UPDATED_AT FUNCTION (if not exists)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. CREATE TRIGGER FOR CONTACTS TABLE
-- =============================================
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;

-- Create trigger
CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON contacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 5. CREATE POLICY FOR CONTACTS TABLE
-- =============================================
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations for contacts" ON contacts;

-- Create policy
CREATE POLICY "Allow all operations for contacts" ON contacts
FOR ALL USING (true);

-- 6. INSERT SAMPLE CONTACT DATA
-- =============================================
INSERT INTO contacts (name, email, phone, subject, message, status, priority) 
VALUES
  ('John Doe', 'john@example.com', '+91-9876543210', 'general', 'I would like to know more about your astrology services.', 'new', 'normal'),
  ('Sarah Smith', 'sarah@example.com', '+91-9876543211', 'astrology', 'Need consultation for career guidance through astrology.', 'read', 'high');

-- 7. VERIFY TABLE EXISTS
-- =============================================
SELECT 'contacts table exists' as status WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'contacts'
);

-- 8. SHOW TABLE STRUCTURE
-- =============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;
