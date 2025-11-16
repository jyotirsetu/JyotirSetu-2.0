import type { APIRoute } from 'astro';
import { supabaseDataService } from '../../lib/supabase-data';
import { emailService } from '../../lib/email-service';
import { getTursoClient, ensureAppointmentsTable } from '../../lib/turso';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('📝 Appointment API called');
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
    console.log('✅ All required fields validated');

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

    // Compute and persist customer-facing Appointment ID in Turso for admin visibility
    try {
      await ensureAppointmentsTable();
      const client = await getTursoClient();
      const makePublicId = (dateStr: string): string => {
        try {
          const yyyymmdd = String(dateStr || '').replace(/-/g, '');
          const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return `${yyyymmdd}${rand}`;
        } catch { return `${Date.now()}`; }
      };
      const publicId = makePublicId(String(appointmentData.date));

      // Upsert minimal row into Turso appointments table for admin
      try {
        await client.execute({
          sql: `INSERT INTO appointments (id, name, email, phone, service, date, time, consultation_method, status, message, source, customer_appointment_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                  name=excluded.name,
                  email=excluded.email,
                  phone=excluded.phone,
                  service=excluded.service,
                  date=excluded.date,
                  time=excluded.time,
                  consultation_method=excluded.consultation_method,
                  status=excluded.status,
                  message=excluded.message,
                  source='system',
                  customer_appointment_id=excluded.customer_appointment_id,
                  created_at=excluded.created_at`,
          args: [
            String(newAppointment.id),
            String(newAppointment.name),
            String(newAppointment.email),
            String(newAppointment.phone),
            String(newAppointment.service),
            String(newAppointment.date),
            String(newAppointment.time),
            String(newAppointment.consultation_method || 'call'),
            String(newAppointment.status || 'pending'),
            newAppointment.message ? String(newAppointment.message) : null,
            'system',
            publicId,
            new Date().toISOString()
          ]
        });
      } catch (upErr) {
        console.warn('⚠️ Turso upsert failed (non-blocking):', upErr);
      }

      // Send confirmation email with the same public id
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
          service_details: appointmentData.service_details || {},
          public_id: publicId
        });
        console.log('📧 Email service result:', emailSent);
      } catch (emailError) {
        console.warn('⚠️ Email service failed, but continuing:', emailError);
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
    } catch (persistErr) {
      console.warn('⚠️ Persist/send block failed; continuing without email:', persistErr);
    }

    // Fallback: if Turso or email section threw before response
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
      console.log('📧 Email service result:', emailSent);
    } catch (emailError) {
      console.warn('⚠️ Email service failed, but continuing:', emailError);
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
    console.error('Public appointment creation error:', error);
    
    // Enhanced error logging
    console.error('Detailed error information:', {
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
