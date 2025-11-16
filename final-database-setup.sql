-- =============================================
-- FINAL JyotirSetu Database Setup (NO ERRORS)
-- =============================================

-- 1. CREATE APPOINTMENTS TABLE (Complete Setup)
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  consultation_method TEXT NOT NULL DEFAULT 'call' CHECK (consultation_method IN ('call', 'video-call', 'in-person', 'whatsapp')),
  message TEXT,
  service_details JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE CONTACTS TABLE (for contact form submissions)
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

-- 3. CREATE UPDATED_AT FUNCTION (if not exists)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. CREATE TRIGGERS FOR BOTH TABLES
-- =============================================
-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;

-- Create triggers
CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON contacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. ENABLE ROW LEVEL SECURITY FOR BOTH TABLES
-- =============================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 6. CREATE POLICIES FOR BOTH TABLES
-- =============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for appointments" ON appointments;
DROP POLICY IF EXISTS "Allow all operations for contacts" ON contacts;

-- Create policies
CREATE POLICY "Allow all operations for appointments" ON appointments
FOR ALL USING (true);

CREATE POLICY "Allow all operations for contacts" ON contacts
FOR ALL USING (true);

-- 7. INSERT SAMPLE APPOINTMENT DATA (SIMPLE INSERT - NO CONFLICTS)
-- =============================================
INSERT INTO appointments (name, email, phone, service, date, time, status, consultation_method, message, service_details) 
VALUES
  ('Priya Sharma', 'priya@example.com', '+91-9876543210', 'kundli-analysis', '2024-01-15', '10:00:00', 'scheduled', 'video-call', 'Birth chart analysis needed', '{"dateOfBirth": "1990-05-15", "birthTime": "14:30", "birthPlace": "Mumbai, Maharashtra"}'),
  ('Rajesh Kumar', 'rajesh@example.com', '+91-9876543211', 'gemstone-consultation', '2024-01-16', '14:00:00', 'scheduled', 'call', 'Need gemstone recommendation', '{"wearingPurpose": "wealth", "currentProfession": "Software Engineer", "dateOfBirth": "1985-08-15", "birthTime": "14:30", "wearingGemstone": "None currently"}');

-- 8. INSERT SAMPLE CONTACT DATA (SIMPLE INSERT - NO CONFLICTS)
-- =============================================
INSERT INTO contacts (name, email, phone, subject, message, status, priority) 
VALUES
  ('John Doe', 'john@example.com', '+91-9876543210', 'general', 'I would like to know more about your astrology services.', 'new', 'normal'),
  ('Sarah Smith', 'sarah@example.com', '+91-9876543211', 'astrology', 'Need consultation for career guidance through astrology.', 'read', 'high');

-- 9. VERIFY TABLES EXIST
-- =============================================
SELECT 'appointments table exists' as status WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'appointments'
);

SELECT 'contacts table exists' as status WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'contacts'
);

-- 10. SHOW TABLE STRUCTURES
-- =============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'appointments' 
ORDER BY ordinal_position;

SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;
