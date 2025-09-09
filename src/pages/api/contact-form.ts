import type { APIRoute } from 'astro';
import { supabaseDataService } from '../../lib/supabase-data';
import { emailService } from '../../lib/email-service';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('📝 Contact Form API called');
    const contactData = await request.json();
    console.log('📊 Received contact data:', contactData);

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!contactData[field]) {
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
    console.log('✅ All required contact fields validated');

    // Create contact in Supabase
    const newContact = await supabaseDataService.createContact({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || undefined,
      subject: contactData.subject,
      message: contactData.message,
      status: 'new' as const,
      priority: 'normal' as const
    });

    console.log('📊 Contact saved to database:', newContact);

    // Send confirmation email (don't fail if email fails)
    let emailSent = false;
    try {
      emailSent = await emailService.sendContactConfirmationEmail({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message
      });
      console.log('📧 Contact email service result:', emailSent);
    } catch (emailError) {
      console.warn('⚠️ Contact email service failed, but continuing:', emailError);
      emailSent = false;
    }

    console.log('✅ Contact created successfully');
    return new Response(JSON.stringify({
      success: true,
      data: newContact,
      message: emailSent 
        ? 'Thank you for your message! We will get back to you soon.'
        : 'Thank you for your message! We will contact you soon.',
      emailSent: emailSent
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Contact form creation error:', error);
    
    // Enhanced error logging
    console.error('Detailed contact error information:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return more specific error message
    let errorMessage = 'Failed to send message';
    if (error.message.includes('connection') || error.message.includes('network')) {
      errorMessage = 'Database connection failed. Please try again.';
    } else if (error.message.includes('validation')) {
      errorMessage = 'Invalid data provided. Please check your input.';
    } else if (error.message.includes('duplicate')) {
      errorMessage = 'A message with this information already exists.';
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
