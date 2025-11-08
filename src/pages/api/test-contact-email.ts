import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Test contact data
    const testContactData = {
      name: 'Akansh Test',
      email: 'akansh.pcj@gmail.com',
      phone: '9876543210',
      subject: 'Test Contact Message',
      message: 'This is a test contact message to verify email functionality.'
    };
    
    console.log('🧪 Sending test contact confirmation email to:', testContactData.email);
    
    // Send test contact confirmation email
    const emailSent = await emailService.sendContactConfirmationEmail(testContactData);
    
    if (emailSent) {
      console.log('✅ Test contact confirmation email sent successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Test contact confirmation email sent successfully to akansh.pcj@gmail.com'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ Failed to send test contact confirmation email');
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send test contact confirmation email'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ Error in test-contact-email API:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
