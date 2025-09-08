-- =============================================
-- APPOINTMENTS TABLE SETUP ONLY
-- =============================================

-- 1. CREATE APPOINTMENTS TABLE
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

-- 2. CREATE UPDATED_AT FUNCTION (if not exists)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. CREATE TRIGGER FOR APPOINTMENTS TABLE
-- =============================================
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;

-- Create trigger
CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 5. CREATE POLICY FOR APPOINTMENTS TABLE
-- =============================================
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations for appointments" ON appointments;

-- Create policy
CREATE POLICY "Allow all operations for appointments" ON appointments
FOR ALL USING (true);

-- 6. INSERT SAMPLE APPOINTMENT DATA
-- =============================================
INSERT INTO appointments (name, email, phone, service, date, time, status, consultation_method, message, service_details) 
VALUES
  ('Priya Sharma', 'priya@example.com', '+91-9876543210', 'kundli-analysis', '2024-01-15', '10:00:00', 'scheduled', 'video-call', 'Birth chart analysis needed', '{"dateOfBirth": "1990-05-15", "birthTime": "14:30", "birthPlace": "Mumbai, Maharashtra"}'),
  ('Rajesh Kumar', 'rajesh@example.com', '+91-9876543211', 'gemstone-consultation', '2024-01-16', '14:00:00', 'scheduled', 'call', 'Need gemstone recommendation', '{"wearingPurpose": "wealth", "currentProfession": "Software Engineer", "dateOfBirth": "1985-08-15", "birthTime": "14:30", "wearingGemstone": "None currently"}');

-- 7. VERIFY TABLE EXISTS
-- =============================================
SELECT 'appointments table exists' as status WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'appointments'
);

-- 8. SHOW TABLE STRUCTURE
-- =============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'appointments' 
ORDER BY ordinal_position;
