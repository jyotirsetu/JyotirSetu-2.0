import type { APIRoute } from 'astro';
import { emailService } from '~/lib/email-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Test appointment data
    const testAppointmentData = {
      name: 'Akansh Test',
      email: 'akansh.pcj@gmail.com',
      phone: '9876543210',
      service: 'kundli-analysis',
      date: '2025-01-30',
      time: '10:00 AM',
      consultation_method: 'Video Call',
      message: 'This is a test appointment to verify email functionality.',
      service_details: {
        birth_date: '1990-01-01',
        birth_time: '10:30 AM',
        birth_place: 'Delhi, India',
        gender: 'Male'
      }
    };
    
    console.log('🧪 Sending test confirmation email to:', testAppointmentData.email);
    
    // Send test confirmation email
    const emailSent = await emailService.sendConfirmationEmail(testAppointmentData);
    
    if (emailSent) {
      console.log('✅ Test confirmation email sent successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Test confirmation email sent successfully to akansh.pcj@gmail.com'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ Failed to send test confirmation email');
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send test confirmation email'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ Error in test-email API:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
