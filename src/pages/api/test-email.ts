import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const toEmail = String(body?.email || '').trim();

    // Basic validation; allow fallback if no email provided
    const recipient = /\S+@\S+\.\S+/.test(toEmail) ? toEmail : 'guidance@jyotirsetu.com';

    const testAppointmentData = {
      name: 'Admin Test',
      email: recipient,
      phone: '9999999999',
      service: 'kundli-analysis',
      date: new Date().toISOString().slice(0, 10),
      time: '10:00 AM',
      consultation_method: 'Video Call',
      message: 'Test email triggered from Admin Settings.',
      service_details: {
        note: 'Admin test email',
      },
    };

    console.log('🧪 Sending test confirmation email to:', testAppointmentData.email);

    const emailSent = await emailService.sendConfirmationEmail(testAppointmentData);

    return new Response(
      JSON.stringify({
        ok: emailSent,
        to: testAppointmentData.email,
        message: emailSent ? 'Test email accepted by provider' : 'Email provider returned an error (see server logs)',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: unknown }).message ?? 'Internal server error')
        : 'Internal server error';
    console.error('❌ Error in test-email API:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: message,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
