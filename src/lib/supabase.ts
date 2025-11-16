import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://mholipxwywbkrqdzqhyy.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ob2xpcHh3eXdia3JxZHpxaHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA5ODYsImV4cCI6MjA3MjczNjk4Nn0.FjZ4Rxr6sJIE6jJUgSd6jqzjAenw8Bpqhy0M9R0UVPU';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone?: string;
          subject: string;
          message: string;
          status: 'new' | 'read' | 'replied' | 'closed';
          priority: 'low' | 'normal' | 'high' | 'urgent';
          assigned_to?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          subject: string;
          message: string;
          status?: 'new' | 'read' | 'replied' | 'closed';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          assigned_to?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          subject?: string;
          message?: string;
          status?: 'new' | 'read' | 'replied' | 'closed';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          assigned_to?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          service: string;
          date: string;
          time: string;
          status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
          consultation_method: 'call' | 'video-call' | 'in-person' | 'whatsapp';
          message?: string;
          service_details?: Record<string, unknown>;
          rating?: number;
          feedback?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          service: string;
          date: string;
          time: string;
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
          consultation_method?: 'call' | 'video-call' | 'in-person' | 'whatsapp';
          message?: string;
          service_details?: Record<string, unknown>;
          rating?: number;
          feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          service?: string;
          date?: string;
          time?: string;
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
          consultation_method?: 'call' | 'video-call' | 'in-person' | 'whatsapp';
          message?: string;
          service_details?: Record<string, unknown>;
          rating?: number;
          feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_credentials: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_sessions: {
        Row: {
          id: string;
          session_id: string;
          username: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          username: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          username?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
  };
}
