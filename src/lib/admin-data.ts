// Admin Data Management System
// This file handles all data operations for the admin dashboard

export interface Appointment {
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
  created_at: string;
  updated_at: string;
  rating?: number;
  feedback?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  is_active: boolean;
  category: 'astrology' | 'palmistry' | 'numerology' | 'tarot' | 'vastu';
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  service: string;
  rating: number;
  review: string;
  is_approved: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publish_date: string;
  is_published: boolean;
  tags: string[];
  category: string;
  views: number;
}

// Data Storage - In production, this would be replaced with Supabase calls
class AdminDataStore {
  private appointments: Appointment[] = [];
  private services: Service[] = [];
  private testimonials: Testimonial[] = [];
  private blogPosts: BlogPost[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with mock data that matches your dashboard
    this.appointments = [
      {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91-9876543210',
        service: '🔮 Astrology',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'completed',
        consultation_method: 'video-call',
        message: 'Need career guidance',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        rating: 5,
        feedback: 'Excellent consultation'
      },
      {
        id: '2',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91-9876543211',
        service: '✋ Palmistry',
        date: '2024-01-16',
        time: '2:30 PM',
        status: 'pending',
        consultation_method: 'call',
        message: 'Want to know about future',
        created_at: '2024-01-11T14:00:00Z',
        updated_at: '2024-01-11T14:00:00Z'
      },
      {
        id: '3',
        name: 'Sneha Patel',
        email: 'sneha@example.com',
        phone: '+91-9876543212',
        service: '🔢 Numerology',
        date: '2024-01-17',
        time: '11:00 AM',
        status: 'scheduled',
        consultation_method: 'video-call',
        message: 'Life path number analysis',
        created_at: '2024-01-12T09:00:00Z',
        updated_at: '2024-01-12T09:00:00Z'
      }
    ];

    this.services = [
      {
        id: '1',
        name: '🔮 Astrology',
        description: 'Complete birth chart analysis and predictions',
        price: 300,
        duration: 60,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: '💎 Gemstone Consultation',
        description: 'Personalized gemstone recommendations for healing and prosperity',
        price: 400,
        duration: 45,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: '✋ Palmistry',
        description: 'Detailed palm reading and life predictions',
        price: 250,
        duration: 45,
        is_active: true,
        category: 'palmistry',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        name: '🔢 Numerology',
        description: 'Life path number and destiny analysis',
        price: 200,
        duration: 30,
        is_active: true,
        category: 'numerology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        name: '💼 Career & Finance',
        description: 'Professional guidance and financial planning',
        price: 350,
        duration: 60,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '6',
        name: '💕 Matchmaking',
        description: 'Compatibility analysis and relationship guidance',
        price: 500,
        duration: 90,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '7',
        name: '📚 Study / Education',
        description: 'Academic guidance and career path selection',
        price: 200,
        duration: 30,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '8',
        name: '🏢 Corporate Consultation',
        description: 'Business strategy and team harmony guidance',
        price: 600,
        duration: 120,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '9',
        name: '✨ Other Reason',
        description: 'Custom consultation for specific concerns',
        price: 200,
        duration: 30,
        is_active: true,
        category: 'astrology',
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    this.testimonials = [
      {
        id: '1',
        client_name: 'Priya Sharma',
        service: '🔮 Astrology',
        rating: 5,
        review: 'Amazing consultation! Very accurate predictions.',
        is_approved: true,
        created_at: '2024-01-15T12:00:00Z'
      },
      {
        id: '2',
        client_name: 'Amit Singh',
        service: '✋ Palmistry',
        rating: 4,
        review: 'Good reading, helped me understand my future better.',
        is_approved: true,
        created_at: '2024-01-14T15:00:00Z'
      }
    ];
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return this.appointments;
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    return this.appointments.find(apt => apt.id === id) || null;
  }

  async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const index = this.appointments.findIndex(apt => apt.id === id);
    if (index === -1) return null;

    this.appointments[index] = {
      ...this.appointments[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.appointments[index];
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const index = this.appointments.findIndex(apt => apt.id === id);
    if (index === -1) return false;
    this.appointments.splice(index, 1);
    return true;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.services.find(service => service.id === id) || null;
  }

  async createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.services.push(newService);
    return newService;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) return null;

    this.services[index] = { ...this.services[index], ...updates };
    return this.services[index];
  }

  async deleteService(id: string): Promise<boolean> {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    return true;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonials;
  }

  async getTestimonialById(id: string): Promise<Testimonial | null> {
    return this.testimonials.find(testimonial => testimonial.id === id) || null;
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
    const index = this.testimonials.findIndex(testimonial => testimonial.id === id);
    if (index === -1) return null;

    this.testimonials[index] = { ...this.testimonials[index], ...updates };
    return this.testimonials[index];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const index = this.testimonials.findIndex(testimonial => testimonial.id === id);
    if (index === -1) return false;
    this.testimonials.splice(index, 1);
    return true;
  }

  // Dashboard statistics
  async getDashboardStats() {
    const appointments = await this.getAppointments();
    const services = await this.getServices();
    const testimonials = await this.getTestimonials();

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled').length;

    // Calculate total revenue
    const totalRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => {
        const service = services.find(s => s.name === apt.service);
        return sum + (service?.price || 0);
      }, 0);

    // Calculate average rating
    const ratings = appointments
      .filter(apt => apt.rating)
      .map(apt => apt.rating!);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    // Calculate repeat clients (simplified - clients with multiple appointments)
    const clientEmails = appointments.map(apt => apt.email);
    const uniqueClients = new Set(clientEmails).size;
    const repeatClients = clientEmails.length - uniqueClients;

    // Service breakdown
    const serviceBreakdown = services.map(service => {
      const serviceAppointments = appointments.filter(apt => apt.service === service.name);
      const serviceRevenue = serviceAppointments
        .filter(apt => apt.status === 'completed')
        .length * service.price;

      return {
        name: service.name,
        count: serviceAppointments.length,
        revenue: serviceRevenue,
        color: this.getServiceColor(service.category)
      };
    });

    // Monthly revenue (last 7 months)
    const monthlyRevenue = this.calculateMonthlyRevenue(appointments, services);

    // Client demographics
    const clientDemographics = this.calculateClientDemographics(appointments);

    return {
      stats: {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        scheduledAppointments,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        repeatClients,
        newClients: uniqueClients - repeatClients,
        totalTestimonials: testimonials.length
      },
      serviceBreakdown,
      monthlyRevenue,
      clientDemographics,
      recentAppointments: appointments
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    };
  }

  private getServiceColor(category: string): string {
    const colors = {
      astrology: '#3b82f6',
      palmistry: '#10b981',
      numerology: '#f59e0b',
      tarot: '#8b5cf6',
      vastu: '#ef4444'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  }

  private calculateMonthlyRevenue(appointments: Appointment[], services: Service[]) {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const currentDate = new Date();
    
    return months.map((month, index) => {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (6 - index), 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= monthStart && aptDate <= monthEnd && apt.status === 'completed';
      });

      const revenue = monthAppointments.reduce((sum, apt) => {
        const service = services.find(s => s.name === apt.service);
        return sum + (service?.price || 0);
      }, 0);

      return { month, revenue };
    });
  }

  private calculateClientDemographics(_appointments: Appointment[]) {
    // Simplified demographics - in production, you'd have more detailed client data
    const ageGroups = [
      { range: '18-25', count: 25, percentage: 16 },
      { range: '26-35', count: 45, percentage: 29 },
      { range: '36-45', count: 38, percentage: 24 },
      { range: '46-55', count: 28, percentage: 18 },
      { range: '55+', count: 20, percentage: 13 }
    ];

    const topCities = [
      { city: 'Mumbai', count: 35 },
      { city: 'Delhi', count: 28 },
      { city: 'Bangalore', count: 22 },
      { city: 'Pune', count: 18 },
      { city: 'Chennai', count: 15 }
    ];

    return { ageGroups, topCities };
  }

  // Helper method to get clean service name for export (without emojis)
  getCleanServiceName(serviceName: string): string {
    // Remove emojis and extra spaces, keep only the text part
    return serviceName.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
  }

  // Get all services with both display names (with emojis) and clean names (for export)
  getServicesForExport(): Array<{id: string, displayName: string, cleanName: string, price: number, duration: number}> {
    return this.services.map(service => ({
      id: service.id,
      displayName: service.name,
      cleanName: this.getCleanServiceName(service.name),
      price: service.price,
      duration: service.duration
    }));
  }
}

// Export singleton instance
export const adminDataStore = new AdminDataStore();

// Types are already exported above with the interface declarations
