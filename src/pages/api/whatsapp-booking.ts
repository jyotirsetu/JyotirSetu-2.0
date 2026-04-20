import type { APIRoute } from 'astro';
import { supabaseDataService } from '../../lib/supabase-data';
import { getTursoClient, ensureAppointmentsTable } from '../../lib/turso';
import { emailService } from '../../lib/email-service';

/**
 * WhatsApp Bot Booking API
 * Receives appointments from the WhatsApp automation bot
 * POST /api/whatsapp-booking
 */

// CORS headers for WhatsApp bot
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specific domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

// API Key validation (should match your bot's ADMIN_API_KEY)
const VALID_API_KEY = process.env.WHATSAPP_BOT_API_KEY || 'your-secure-api-key-here';

export const POST: APIRoute = async ({ request }) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Validate API Key
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey || apiKey !== VALID_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized - Invalid API Key' 
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Parse request body
    const data = await request.json();
    
    console.log('WhatsApp booking received:', {
      phone: data.phone,
      name: data.name,
      service: data.service,
      timestamp: new Date().toISOString(),
    });

    // Validate required fields
    const requiredFields = ['name', 'phone', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create appointment using the same service as website
    const newAppointment = await supabaseDataService.createAppointment({
      name: data.name,
      email: data.email || `whatsapp-${data.phone}@placeholder.com`,
      phone: data.phone,
      service: data.service,
      date: data.date,
      time: data.time,
      status: 'scheduled' as const,
      consultation_method: data.consultation_method || ('whatsapp' as const),
      message: data.message || `Service: ${data.service}. Source: WhatsApp Bot`,
      service_details: {
        ...(data.service_details || {}),
        source: 'whatsapp-bot',
        whatsapp_phone: data.phone,
      },
    });

    console.log('Appointment created (via service):', {
      id: newAppointment.id,
      phone: newAppointment.phone,
      service: newAppointment.service,
    });

    // Generate public ID for appointment (used in Turso and email)
    const makePublicId = (dateStr: string): string => {
      try {
        const yyyymmdd = String(dateStr || '').replace(/-/g, '');
        const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${yyyymmdd}${rand}`;
      } catch {
        return `${Date.now()}`;
      }
    };
    const publicId = makePublicId(String(newAppointment.date));

    // Sync to Turso (Admin Dashboard database) - THE REAL STORAGE
    try {
      await ensureAppointmentsTable();
      const tursoClient = await getTursoClient();

      await tursoClient.execute({
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
                source=excluded.source,
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
          String(newAppointment.consultation_method || 'whatsapp'),
          String(newAppointment.status || 'scheduled'),
          newAppointment.message ? String(newAppointment.message) : null,
          'whatsapp-bot',
          publicId,
          new Date().toISOString(),
        ],
      });

      console.log('Appointment synced to Turso (Admin Dashboard):', {
        id: newAppointment.id,
        publicId,
      });
    } catch (tursoError) {
      console.error('Failed to sync to Turso:', tursoError);
      // This is critical - Turso is the real database!
      throw new Error('Failed to save to admin dashboard database');
    }

    // Send confirmation email (non-blocking - don't fail if email fails)
    let emailSent = false;
    if (data.email && !data.email.includes('placeholder.com')) {
      try {
        emailSent = await emailService.sendConfirmationEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          date: data.date,
          time: data.time,
          consultation_method: data.consultation_method || 'whatsapp',
          message: data.message,
          service_details: data.service_details || {},
          public_id: publicId,
        });
        console.log('📧 Email sent to customer:', emailSent);
      } catch (emailError) {
        console.warn('⚠️ Email sending failed, but continuing:', emailError);
        emailSent = false;
      }
    } else {
      console.log('ℹ️ No valid email provided, skipping email notification');
    }

    // Use the newAppointment for response
    const appointment = newAppointment;

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: emailSent 
          ? 'Appointment created successfully! Confirmation email sent.'
          : 'Appointment created successfully!',
        emailSent,
        data: {
          id: appointment.id,
          name: appointment.name,
          phone: appointment.phone,
          service: appointment.service,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          consultation_method: appointment.consultation_method,
          created_at: appointment.created_at,
        },
      }),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error creating WhatsApp appointment:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create appointment',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};
