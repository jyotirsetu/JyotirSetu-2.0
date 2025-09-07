import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    console.log('📧 Resend Webhook received:', data);
    
    // Handle different email events
    switch (data.type) {
      case 'email.sent':
        console.log('✅ Email sent successfully:', data.data);
        await handleEmailSent(data.data);
        break;
        
      case 'email.delivered':
        console.log('📬 Email delivered:', data.data);
        await handleEmailDelivered(data.data);
        break;
        
      case 'email.delivery_delayed':
        console.log('⏰ Email delivery delayed:', data.data);
        await handleEmailDelayed(data.data);
        break;
        
      case 'email.complained':
        console.log('🚨 Spam complaint received:', data.data);
        await handleSpamComplaint(data.data);
        break;
        
      case 'email.bounced':
        console.log('❌ Email bounced:', data.data);
        await handleEmailBounced(data.data);
        break;
        
      case 'email.opened':
        console.log('👀 Email opened:', data.data);
        await handleEmailOpened(data.data);
        break;
        
      case 'email.clicked':
        console.log('🔗 Email link clicked:', data.data);
        await handleEmailClicked(data.data);
        break;
        
      default:
        console.log('ℹ️ Unknown event type:', data.type);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
};

// Handle email sent event
async function handleEmailSent(data: any) {
  // Log email sent for analytics
  console.log('Email sent to:', data.to);
  console.log('Subject:', data.subject);
}

// Handle email delivered event
async function handleEmailDelivered(data: any) {
  // Update email status in database if needed
  console.log('Email delivered to:', data.to);
  
  // You can update your database here to mark email as delivered
  // Example: Update appointment status, newsletter delivery status, etc.
}

// Handle email delivery delayed
async function handleEmailDelayed(data: any) {
  console.log('Email delivery delayed for:', data.to);
  console.log('Reason:', data.reason);
  
  // You might want to send a notification to admin about delayed emails
}

// Handle spam complaint
async function handleSpamComplaint(data: any) {
  console.log('Spam complaint from:', data.to);
  
  // Important: Remove this email from your newsletter list
  // You should implement automatic unsubscribe here
  try {
    // Example: Remove from newsletter list
    // await supabase.from('newsletter_subscribers').delete().eq('email', data.to);
    console.log('⚠️ Consider removing email from newsletter list:', data.to);
  } catch (error) {
    console.error('Error handling spam complaint:', error);
  }
}

// Handle email bounced
async function handleEmailBounced(data: any) {
  console.log('Email bounced for:', data.to);
  console.log('Bounce type:', data.bounce_type);
  console.log('Reason:', data.reason);
  
  // Handle hard bounces (permanent failures)
  if (data.bounce_type === 'hard') {
    console.log('🚨 Hard bounce - remove email from list:', data.to);
    // Remove from your email lists
  }
  
  // Handle soft bounces (temporary failures)
  if (data.bounce_type === 'soft') {
    console.log('⚠️ Soft bounce - retry later:', data.to);
    // You might want to retry sending later
  }
}

// Handle email opened
async function handleEmailOpened(data: any) {
  console.log('Email opened by:', data.to);
  console.log('Opened at:', data.opened_at);
  
  // Track newsletter engagement
  // You can update analytics in your database
}

// Handle email link clicked
async function handleEmailClicked(data: any) {
  console.log('Link clicked by:', data.to);
  console.log('Clicked link:', data.link);
  console.log('Clicked at:', data.clicked_at);
  
  // Track newsletter engagement
  // You can update analytics in your database
}
