import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contactData = await request.json();
    
    console.log('📧 Sending contact confirmation email:', contactData);
    
    // Send confirmation email
    const emailSent = await emailService.sendContactConfirmationEmail(contactData);
    
    if (emailSent) {
      console.log('✅ Contact confirmation email sent successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Contact confirmation email sent successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ Failed to send contact confirmation email');
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send contact confirmation email'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ Error in send-contact-confirmation API:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
