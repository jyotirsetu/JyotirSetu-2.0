import type { APIRoute } from 'astro';
import { supabaseDataService } from '../../lib/supabase-data';
import { emailService } from '../../lib/email-service';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('📝 Appointment Form API called');
    const appointmentData = await request.json();
    console.log('📊 Received appointment data:', appointmentData);

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        console.log(`❌ Missing required field: ${field}`);
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
    console.log('✅ All required appointment fields validated');

    // Create appointment in Supabase
    const newAppointment = await supabaseDataService.createAppointment({
      name: appointmentData.name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      service: appointmentData.service,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'scheduled' as const,
      consultation_method: appointmentData.consultation_method || 'call' as const,
      message: appointmentData.message,
      service_details: appointmentData.service_details || {}
    });

    console.log('📊 Appointment saved to database:', newAppointment);

    // Send confirmation email (don't fail if email fails)
    let emailSent = false;
    try {
      emailSent = await emailService.sendConfirmationEmail({
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        service: appointmentData.service,
        date: appointmentData.date,
        time: appointmentData.time,
        consultation_method: appointmentData.consultation_method || 'call',
        message: appointmentData.message,
        service_details: appointmentData.service_details || {}
      });
      console.log('📧 Appointment email service result:', emailSent);
    } catch (emailError) {
      console.warn('⚠️ Appointment email service failed, but continuing:', emailError);
      emailSent = false;
    }

    console.log('✅ Appointment created successfully');
    return new Response(JSON.stringify({
      success: true,
      data: newAppointment,
      message: emailSent 
        ? 'Appointment created successfully! You will receive a confirmation email shortly.'
        : 'Appointment created successfully! We will contact you soon.',
      emailSent: emailSent
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Appointment form creation error:', error);
    
    // Enhanced error logging
    console.error('Detailed appointment error information:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return more specific error message
    let errorMessage = 'Failed to create appointment';
    if (error.message.includes('connection') || error.message.includes('network')) {
      errorMessage = 'Database connection failed. Please try again.';
    } else if (error.message.includes('validation')) {
      errorMessage = 'Invalid data provided. Please check your input.';
    } else if (error.message.includes('duplicate')) {
      errorMessage = 'An appointment with this information already exists.';
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
