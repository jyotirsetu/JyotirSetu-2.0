import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';

export const GET: APIRoute = async () => {
  try {
    // Test email configuration
    const hasApiKey = !!import.meta.env.RESEND_API_KEY;
    const fromEmail = import.meta.env.FROM_EMAIL || 'JyotirSetu <noreply@jyotirsetu.com>';
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email service configuration check',
      config: {
        hasApiKey,
        fromEmail,
        apiKeyPrefix: hasApiKey ? import.meta.env.RESEND_API_KEY.substring(0, 10) + '...' : 'Not configured'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Error checking email configuration',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Test email address is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send test email
    const testData = {
      name: 'Test User',
      email: testEmail,
      phone: '+1234567890',
      subject: 'Test Query',
      message: 'This is a test message to verify email functionality.'
    };

    const emailSent = await emailService.sendContactConfirmationEmail(testData);
    
    if (emailSent) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Test email sent successfully!',
        testEmail
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send test email'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Error sending test email',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
