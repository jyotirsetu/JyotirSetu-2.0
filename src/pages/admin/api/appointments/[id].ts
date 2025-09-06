import type { APIRoute } from 'astro';
import { supabaseDataService } from '../../../../lib/supabase-data';

export const GET: APIRoute = async ({ params, cookies }) => {
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

    const appointmentId = params.id;
    if (!appointmentId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Appointment ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const appointment = await supabaseDataService.getAppointmentById(appointmentId);

    if (!appointment) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Appointment not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: appointment
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Appointment fetch error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch appointment'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
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

    const appointmentId = params.id;
    if (!appointmentId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Appointment ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const updateData = await request.json();

    // Update the appointment
    const updatedAppointment = await supabaseDataService.updateAppointment(appointmentId, updateData);

    if (!updatedAppointment) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Appointment not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedAppointment
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Appointment update error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update appointment'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};