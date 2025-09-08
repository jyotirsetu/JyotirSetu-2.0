import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    const appointmentData = await request.json();
    
    console.log('📧 Sending confirmation email for appointment:', appointmentData);
    
    // Send confirmation email
    const emailSent = await emailService.sendConfirmationEmail(appointmentData);
    
    if (emailSent) {
      console.log('✅ Confirmation email sent successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Confirmation email sent successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ Failed to send confirmation email');
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send confirmation email'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ Error in send-confirmation-email API:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
