import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabase';
import { getTursoClient, ensureAppointmentsTable } from '~/lib/turso';

type AppointmentData = {
  form_type: 'appointment';
  name: string;
  email: string;
  phone?: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
};

type ContactData = {
  form_type: 'contact';
  name: string;
  email: string;
  subject: string;
  message: string;
};

type NewsletterData = {
  form_type: 'newsletter';
  email: string;
  name?: string;
};

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    console.log('📝 Form Webhook received:', data);
    
    // Handle different form types
    switch (data.form_type) {
      case 'appointment':
        await handleAppointmentSubmission(data as AppointmentData);
        break;
        
      case 'contact':
        await handleContactSubmission(data as ContactData);
        break;
        
      case 'newsletter':
        await handleNewsletterSubscription(data as NewsletterData);
        break;
        
      default:
        console.log('ℹ️ Unknown form type:', data.form_type);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Form webhook error:', msg);
    return new Response('Error', { status: 500 });
  }
};

// Handle appointment form submission
async function handleAppointmentSubmission(data: AppointmentData) {
  console.log('📅 New appointment submission:', data);
  
  try {
    // Store appointment in Supabase and return inserted row (including id)
    const { data: inserted, error } = await supabase
      .from('appointments')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        message: data.message,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error storing appointment:', error);
      return;
    }
    
    console.log('✅ Appointment stored successfully', inserted);

    // Mirror into Turso for admin visibility (source: webhook)
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
      const publicId = makePublicId(String(data.preferred_date));

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
                source='webhook',
                customer_appointment_id=excluded.customer_appointment_id,
                created_at=excluded.created_at`,
        args: [
          String(inserted?.id || crypto.randomUUID()),
          String(data.name),
          String(data.email),
          String(data.phone || ''),
          String(data.service),
          String(data.preferred_date),
          String(data.preferred_time),
          'call',
          'pending',
          data.message ? String(data.message) : null,
          'webhook',
          publicId,
          new Date().toISOString()
        ]
      });
    } catch (mirrorErr) {
      console.warn('⚠️ Turso mirror failed (non-blocking):', mirrorErr);
    }
    
    // Send confirmation email to customer
    await sendAppointmentConfirmation(data);
    
    // Send notification to admin
    await sendAdminNotification(data);
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error handling appointment:', msg);
  }
}

// Handle contact form submission
async function handleContactSubmission(data: ContactData) {
  console.log('📞 New contact submission:', data);
  
  try {
    // Store contact message in database
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: 'new',
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error storing contact message:', error);
      return;
    }
    
    console.log('✅ Contact message stored successfully');
    
    // Send auto-reply to customer
    await sendContactAutoReply(data);
    
    // Send notification to admin
    await sendAdminNotification(data);
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error handling contact:', msg);
  }
}

// Handle newsletter subscription
async function handleNewsletterSubscription(data: NewsletterData) {
  console.log('📧 New newsletter subscription:', data);
  
  try {
    // Store newsletter subscription in database
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: data.email,
        name: data.name || null,
        status: 'active',
        subscribed_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error storing newsletter subscription:', error);
      return;
    }
    
    console.log('✅ Newsletter subscription stored successfully');
    
    // Send welcome email
    await sendNewsletterWelcome(data);
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error handling newsletter subscription:', msg);
  }
}

// Send appointment confirmation email
async function sendAppointmentConfirmation(data: AppointmentData) {
  try {
    // Integrate your email service here using data
    // You can use your email service here
    console.log('📧 Sending appointment confirmation to:', data.email);
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error sending appointment confirmation:', msg);
  }
}

// Send contact auto-reply
async function sendContactAutoReply(data: ContactData) {
  try {
    // Integrate your email service here using data
    console.log('📧 Sending auto-reply to:', data.email);
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error sending auto-reply:', msg);
  }
}

// Send newsletter welcome email
async function sendNewsletterWelcome(data: NewsletterData) {
  try {
    // Integrate your email service here using data
    console.log('📧 Sending welcome email to:', data.email);
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error sending welcome email:', msg);
  }
}

// Send admin notification
async function sendAdminNotification(_data: AppointmentData | ContactData | NewsletterData) {
  try {
    // Integrate your email service here using data
    console.log('📧 Sending admin notification');
    
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error sending admin notification:', msg);
  }
}
