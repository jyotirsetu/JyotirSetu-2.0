import type { APIRoute } from 'astro';
import { supabaseDataService } from '../../../lib/supabase-data';

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    // Check if user is logged in
    const adminSession = cookies.get('admin-session');
    if (!adminSession) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get query parameters for filtering
    const status = url.searchParams.get('status');
    const service = url.searchParams.get('service');
    const limit = url.searchParams.get('limit');

    const appointments = await supabaseDataService.getAppointmentsWithFilters({
      status: status || undefined,
      service: service || undefined,
      limit: limit ? parseInt(limit) : undefined
    });

    return new Response(JSON.stringify({
      success: true,
      data: appointments
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch appointments'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is logged in
    const adminSession = cookies.get('admin-session');
    if (!adminSession) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const appointmentData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return new Response(JSON.stringify({
          success: false,
          message: `${field} is required`
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    const newAppointment = await supabaseDataService.createAppointment({
      name: appointmentData.name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      service: appointmentData.service,
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status || 'pending',
      consultation_method: appointmentData.consultation_method || 'call',
      message: appointmentData.message,
      service_details: appointmentData.service_details
    });

    return new Response(JSON.stringify({
      success: true,
      data: newAppointment
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create appointment'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
