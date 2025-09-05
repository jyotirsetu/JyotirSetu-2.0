// WhatsApp Confirmation Webhook Handler
// This will be called by Formspree when form is submitted

export async function POST(request) {
  try {
    const formData = await request.json();

    // Extract form data
    const { name, email, phone, service, appointment_date, appointment_time, consultation_method, message } = formData;

    // Format phone number for WhatsApp (remove +91 if present)
    const whatsappPhone = phone.replace(/^\+91-?/, '') + '@c.us';

    // Create WhatsApp message
    const whatsappMessage = `🔮 *JyotirSetu - Appointment Confirmation*

Dear *${name}*,

Thank you for booking your astrology consultation with JyotirSetu! 

📋 *Appointment Details:*
• Service: ${service}
• Date: ${appointment_date}
• Time: ${appointment_time}
• Method: ${consultation_method}

📞 *Contact Information:*
• Phone: ${phone}
• Email: ${email}

💬 *Your Message:*
${message || 'No specific message provided'}

⏰ *Next Steps:*
1. We'll review your request within 24 hours
2. You'll receive a confirmation call/email
3. Payment details will be shared
4. Consultation link/details will be provided

🌟 *What to Expect:*
• Professional astrological guidance
• Personalized solutions for your concerns
• Follow-up support and recommendations

For any questions, contact us:
📱 WhatsApp: +91-9266991298
📧 Email: guidance@jyotirsetu.com
📍 Address: Sector-15, Gurugram, Haryana

*Om Namah Shivaya* 🙏
*JyotirSetu - Your Spiritual Guide* ✨

---
*This is an automated confirmation. Please don't reply to this message.*`;

    // Send WhatsApp message using Twilio
    const twilioResponse = await sendWhatsAppMessage(whatsappPhone, whatsappMessage);

    if (twilioResponse.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'WhatsApp confirmation sent successfully',
          whatsapp_sent: true,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('Failed to send WhatsApp message');
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Function to send WhatsApp message via Twilio
async function sendWhatsAppMessage(to, message) {
  try {
    // You'll need to add these environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !fromNumber) {
      console.log('Twilio credentials not configured, skipping WhatsApp');
      return { success: false, reason: 'Credentials not configured' };
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(accountSid + ':' + authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${fromNumber}`,
        To: `whatsapp:${to}`,
        Body: message,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, sid: result.sid };
    } else {
      console.error('Twilio API error:', result);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Twilio request error:', error);
    return { success: false, error: error.message };
  }
}
