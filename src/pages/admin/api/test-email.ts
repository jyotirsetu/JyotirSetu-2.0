import type { APIRoute } from 'astro';
import { sendPasswordResetEmail } from '~/lib/email-service';

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('Testing email service...');
    console.log('RESEND_API_KEY exists:', !!import.meta.env.RESEND_API_KEY);
    console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');
    
    // Test the email service
    await sendPasswordResetEmail('test@example.com', 'https://example.com/test-link');
    
    return new Response(JSON.stringify({
      success: true,
      message: import.meta.env.DEV ? 'Email service disabled on localhost' : 'Email service test completed',
      hasApiKey: !!import.meta.env.RESEND_API_KEY,
      environment: import.meta.env.DEV ? 'development' : 'production',
      emailEnabled: !import.meta.env.DEV
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Email service test failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasApiKey: !!import.meta.env.RESEND_API_KEY,
      environment: import.meta.env.DEV ? 'development' : 'production',
      emailEnabled: !import.meta.env.DEV
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
