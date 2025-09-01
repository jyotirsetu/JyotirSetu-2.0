// WhatsApp Confirmation using WhatsApp Business API
// This is completely FREE and perfect for business use

import { WHATSAPP_CONFIG, WHATSAPP_MESSAGES } from '../config/whatsapp-config.js';

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Extract form data
    const {
      name,
      email,
      phone,
      service,
      appointment_date,
      appointment_time,
      consultation_method,
      message
    } = formData;

    // Format phone number (remove +91 if present)
    const whatsappPhone = phone.replace(/^\+91-?/, '');
    
    // Create WhatsApp message using template
    const whatsappMessage = WHATSAPP_MESSAGES.appointment_confirmation({
      name,
      service,
      appointment_date,
      appointment_time,
      consultation_method,
      phone,
      email,
      message
    });

    // Send WhatsApp message using WhatsApp Business API
    const whatsappResponse = await sendWhatsAppBusinessMessage(whatsappPhone, whatsappMessage);
    
    if (whatsappResponse.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'WhatsApp confirmation sent successfully',
        whatsapp_sent: true,
        phone: whatsappPhone
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to send WhatsApp message');
    }
    
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Function to send WhatsApp message via WhatsApp Business API
async function sendWhatsAppBusinessMessage(to, message) {
  try {
    // Use configuration values
    const accessToken = WHATSAPP_CONFIG.ACCESS_TOKEN;
    const phoneNumberId = WHATSAPP_CONFIG.PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      console.log('WhatsApp Business API credentials not configured, skipping WhatsApp');
      return { success: false, reason: 'Credentials not configured' };
    }

    const response = await fetch(`${WHATSAPP_CONFIG.WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true, messageId: result.messages[0].id };
    } else {
      console.error('WhatsApp Business API error:', result);
      return { success: false, error: result.error?.message || 'Unknown error' };
    }
    
  } catch (error) {
    console.error('WhatsApp Business API request error:', error);
    return { success: false, error: error.message };
  }
}
