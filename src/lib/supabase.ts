import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface DailyTip {
  id: number
  title: string
  content: string
  category: string
  date: string
  active: boolean
  created_at: string
}

export interface Horoscope {
  id: number
  zodiac_sign: string
  content: string
  date: string
  active: boolean
  created_at: string
}

export interface Appointment {
  id: number
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  message: string
  created_at: string
}

export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  image_url: string
  category: string
  tags: string[]
  published: boolean
  created_at: string
}
