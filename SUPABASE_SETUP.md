# 🚀 Supabase Setup Guide

## **Step 1: Create Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `jyotirsetu-admin`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

## **Step 2: Get Your Credentials**

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (`https://mholipxwywbkrqdzqhyy.supabase.co`)
   - **Anon public key** (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ob2xpcHh3eXdia3JxZHpxaHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA5ODYsImV4cCI6MjA3MjczNjk4Nn0.FjZ4Rxr6sJIE6jJUgSd6jqzjAenw8Bpqhy0M9R0UVPU`)

## **Step 3: Create Environment File**

SUPABASE_URL=https://mholipxwywbkrqdzqhyy.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ob2xpcHh3eXdia3JxZHpxaHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA5ODYsImV4cCI6MjA3MjczNjk4Nn0.FjZ4Rxr6sJIE6jJUgSd6jqzjAenw8Bpqhy0M9R0UVPU

## **Step 4: Create Database Table**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  consultation_method TEXT NOT NULL DEFAULT 'call' CHECK (consultation_method IN ('call', 'video-call', 'in-person', 'whatsapp')),
  message TEXT,
  service_details JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some test data
INSERT INTO appointments (name, email, phone, service, date, time, status, consultation_method, message, service_details) VALUES
('Priya Sharma', 'priya@example.com', '+91-9876543210', '🔮 Astrology', '2024-01-15', '10:00:00', 'pending', 'video-call', 'Birth chart analysis needed', '{"dateOfBirth": "1990-05-15", "birthTime": "14:30", "birthPlace": "Mumbai, Maharashtra"}'),
('Rajesh Kumar', 'rajesh@example.com', '+91-9876543211', '💎 Gemstone Consultation', '2024-01-16', '14:00:00', 'scheduled', 'call', 'Need gemstone recommendation', '{"wearingPurpose": "wealth", "currentProfession": "Software Engineer", "dateOfBirth": "1985-08-15", "birthTime": "14:30", "wearingGemstone": "None currently"}'),
('Sunita Patel', 'sunita@example.com', '+91-9876543212', '✋ Palmistry', '2024-01-17', '11:30:00', 'completed', 'in-person', 'Palm reading for career guidance', '{"focusArea": "career", "handDominance": "right", "specificConcerns": "Career growth and financial stability"}');

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for admin panel)
CREATE POLICY "Allow all operations for admin" ON appointments
FOR ALL USING (true);
```

## **Step 5: Test the Connection**

After setting up everything, the system will:
1. ✅ Connect to your Supabase database
2. ✅ Load real data from the database
3. ✅ Update status changes persistently
4. ✅ Show real-time updates

## **🔧 Troubleshooting**

### **Common Issues:**

1. **"Invalid API key"**
   - Check your `.env` file has correct credentials
   - Make sure you copied the full anon key

2. **"Table doesn't exist"**
   - Run the SQL script in Supabase SQL Editor
   - Check table name is exactly `appointments`

3. **"Permission denied"**
   - Check RLS policies are set up correctly
   - Make sure the policy allows all operations

### **Need Help?**
- Check Supabase logs in the dashboard
- Verify your environment variables
- Test the connection in Supabase dashboard

---

**Once set up, your admin panel will have a real database with persistent data!** 🎉
