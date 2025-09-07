import { supabase, type Database } from './supabase';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export class SupabaseDataService {
  // Get all appointments
  async getAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get appointments:', error);
      throw error;
    }
  }

  // Get appointment by ID
  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get appointment by ID:', error);
      return null;
    }
  }

  // Create new appointment
  async createAppointment(appointment: AppointmentInsert): Promise<Appointment> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      throw error;
    }
  }

  // Update appointment
  async updateAppointment(id: string, updates: AppointmentUpdate): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      throw error;
    }
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      throw error;
    }
  }

  // Get appointments with filters
  async getAppointmentsWithFilters(filters: {
    status?: string;
    service?: string;
    limit?: number;
  }): Promise<Appointment[]> {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.service) {
        query = query.eq('service', filters.service);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching filtered appointments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get filtered appointments:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }

      console.log('✅ Supabase connection successful!');
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const supabaseDataService = new SupabaseDataService();
