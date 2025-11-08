import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabase';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    console.log('📝 Form Webhook received:', data);
    
    // Handle different form types
    switch (data.form_type) {
      case 'appointment':
        await handleAppointmentSubmission(data);
        break;
        
      case 'contact':
        await handleContactSubmission(data);
        break;
        
      case 'newsletter':
        await handleNewsletterSubscription(data);
        break;
        
      default:
        console.log('ℹ️ Unknown form type:', data.form_type);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('❌ Form webhook error:', error);
    return new Response('Error', { status: 500 });
  }
};

// Handle appointment form submission
async function handleAppointmentSubmission(data: any) {
  console.log('📅 New appointment submission:', data);
  
  try {
    // Store appointment in database
    const { data: appointment, error } = await supabase
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
      });
    
    if (error) {
      console.error('Error storing appointment:', error);
      return;
    }
    
    console.log('✅ Appointment stored successfully');
    
    // Send confirmation email to customer
    await sendAppointmentConfirmation(data);
    
    // Send notification to admin
    await sendAdminNotification(data);
    
  } catch (error) {
    console.error('Error handling appointment:', error);
  }
}

// Handle contact form submission
async function handleContactSubmission(data: any) {
  console.log('📞 New contact submission:', data);
  
  try {
    // Store contact message in database
    const { data: contact, error } = await supabase
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
    
  } catch (error) {
    console.error('Error handling contact:', error);
  }
}

// Handle newsletter subscription
async function handleNewsletterSubscription(data: any) {
  console.log('📧 New newsletter subscription:', data);
  
  try {
    // Store newsletter subscription in database
    const { data: subscription, error } = await supabase
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
    
  } catch (error) {
    console.error('Error handling newsletter subscription:', error);
  }
}

// Send appointment confirmation email
async function sendAppointmentConfirmation(data: any) {
  try {
    const confirmationEmail = {
      to: data.email,
      subject: 'Appointment Confirmation - JyotirSetu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <img src="https://www.jyotirsetu.com/src/assets/images/JyotirSetu%20Full%20Logo%20Transparent.png" alt="JyotirSetu Logo" style="max-width: 200px; height: auto;" />
          </div>
          
          <h2>Appointment Confirmation</h2>
          
          <p>Dear ${data.name},</p>
          
          <p>Thank you for booking an appointment with JyotirSetu. We have received your request and will contact you soon to confirm the details.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Appointment Details:</h3>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Preferred Date:</strong> ${data.preferred_date}</p>
            <p><strong>Preferred Time:</strong> ${data.preferred_time}</p>
            <p><strong>Message:</strong> ${data.message || 'No additional message'}</p>
          </div>
          
          <p>We will contact you within 24 hours to confirm your appointment.</p>
          
          <p>Best regards,<br>JyotirSetu Team</p>
        </div>
      `
    };
    
    // You can use your email service here
    console.log('📧 Sending appointment confirmation to:', data.email);
    
  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
  }
}

// Send contact auto-reply
async function sendContactAutoReply(data: any) {
  try {
    const autoReplyEmail = {
      to: data.email,
      subject: 'Thank you for contacting JyotirSetu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <img src="https://www.jyotirsetu.com/src/assets/images/JyotirSetu%20Full%20Logo%20Transparent.png" alt="JyotirSetu Logo" style="max-width: 200px; height: auto;" />
          </div>
          
          <h2>Thank you for contacting us!</h2>
          
          <p>Dear ${data.name},</p>
          
          <p>We have received your message and will get back to you within 24 hours.</p>
          
          <p>Best regards,<br>JyotirSetu Team</p>
        </div>
      `
    };
    
    console.log('📧 Sending auto-reply to:', data.email);
    
  } catch (error) {
    console.error('Error sending auto-reply:', error);
  }
}

// Send newsletter welcome email
async function sendNewsletterWelcome(data: any) {
  try {
    const welcomeEmail = {
      to: data.email,
      subject: 'Welcome to JyotirSetu Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <img src="https://www.jyotirsetu.com/src/assets/images/JyotirSetu%20Full%20Logo%20Transparent.png" alt="JyotirSetu Logo" style="max-width: 200px; height: auto;" />
          </div>
          
          <h2>Welcome to JyotirSetu Newsletter!</h2>
          
          <p>Dear ${data.name || 'Friend'},</p>
          
          <p>Thank you for subscribing to our newsletter. You will now receive:</p>
          
          <ul>
            <li>Weekly astrology insights</li>
            <li>Special offers and discounts</li>
            <li>Important festival dates</li>
            <li>Expert advice from our astrologers</li>
          </ul>
          
          <p>Best regards,<br>JyotirSetu Team</p>
        </div>
      `
    };
    
    console.log('📧 Sending welcome email to:', data.email);
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// Send admin notification
async function sendAdminNotification(data: any) {
  try {
    const adminEmail = {
      to: 'jyotirsetu@gmail.com',
      subject: `New ${data.form_type} submission - JyotirSetu`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New ${data.form_type} submission</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
          
          <p>Please check your admin panel for more details.</p>
        </div>
      `
    };
    
    console.log('📧 Sending admin notification');
    
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}
