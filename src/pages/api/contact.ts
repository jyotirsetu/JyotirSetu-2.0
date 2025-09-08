import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';
import { supabaseDataService } from '~/lib/supabase-data';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contactData = await request.json();
    
    console.log('📝 Processing contact form submission:', contactData);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return new Response(JSON.stringify({
          success: false,
          message: `${field} is required`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Save contact data to database
    const newContact = await supabaseDataService.createContact({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
      status: 'new',
      priority: 'normal'
    });

    console.log('📊 Contact saved to database:', newContact);

    // Send confirmation email
    const emailSent = await emailService.sendContactConfirmationEmail(contactData);
    
    if (emailSent) {
      console.log('✅ Contact form processed successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Thank you for your message! We will get back to you within 24-48 hours.',
        data: {
          id: newContact.id,
          timestamp: newContact.created_at
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ Failed to send contact confirmation email');
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to process your message. Please try again or contact us directly.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ Error in contact API:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
