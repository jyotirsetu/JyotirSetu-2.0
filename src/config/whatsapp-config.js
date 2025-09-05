// WhatsApp Business API Configuration
// Update these values with your actual credentials

export const WHATSAPP_CONFIG = {
  // WhatsApp Business API Credentials
  // Get these from Facebook Developers Console
  ACCESS_TOKEN: 'YOUR_ACCESS_TOKEN_HERE', // Replace with your actual access token from Meta
  PHONE_NUMBER_ID: 'YOUR_PHONE_NUMBER_ID_HERE', // Replace with your actual phone number ID from Meta

  // Business Information
  BUSINESS_NAME: 'JyotirSetu',
  BUSINESS_PHONE: '+919266991298',
  BUSINESS_EMAIL: 'guidance@jyotirsetu.com',
  BUSINESS_ADDRESS: 'Sector-15, Gurugram, Haryana',

  // WhatsApp Message Settings
  MESSAGE_TEMPLATE: 'appointment_confirmation', // You can create custom templates
  LANGUAGE: 'en', // Message language

  // API Endpoints
  WHATSAPP_API_URL: 'https://graph.facebook.com/v18.0',

  // Rate Limiting (WhatsApp allows 1000 messages/month free)
  RATE_LIMIT: {
    messagesPerMonth: 1000,
    messagesPerSecond: 1,
  },
};

// WhatsApp Message Templates
export const WHATSAPP_MESSAGES = {
  appointment_confirmation: (data) => `🔮 *JyotirSetu - Appointment Confirmation*

Dear *${data.name}*,

Thank you for booking your astrology consultation with JyotirSetu! 

📋 *Appointment Details:*
• Service: ${data.service}
• Date: ${data.appointment_date}
• Time: ${data.appointment_time}
• Method: ${data.consultation_method}

📞 *Contact Information:*
• Phone: ${data.phone}
• Email: ${data.email}

💬 *Your Message:*
${data.message || 'No specific message provided'}

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
📱 WhatsApp: ${WHATSAPP_CONFIG.BUSINESS_PHONE}
📧 Email: ${WHATSAPP_CONFIG.BUSINESS_EMAIL}
📍 Address: ${WHATSAPP_CONFIG.BUSINESS_ADDRESS}

*Om Namah Shivaya* 🙏
*JyotirSetu - Your Spiritual Guide* ✨

---
*This is an automated confirmation. Please don't reply to this message.*`,

  appointment_reminder: (data) => `🔮 *JyotirSetu - Appointment Reminder*

Dear *${data.name}*,

This is a friendly reminder about your upcoming astrology consultation.

📅 *Appointment Details:*
• Date: ${data.appointment_date}
• Time: ${data.appointment_time}
• Method: ${data.consultation_method}

Please ensure you're available at the scheduled time.

For any changes, contact us immediately:
📱 WhatsApp: ${WHATSAPP_CONFIG.BUSINESS_PHONE}
📧 Email: ${WHATSAPP_CONFIG.BUSINESS_EMAIL}

*Om Namah Shivaya* 🙏
*JyotirSetu* ✨`,

  follow_up: (data) => `🔮 *JyotirSetu - Follow-up Message*

Dear *${data.name}*,

Thank you for your recent consultation with JyotirSetu!

We hope the guidance provided was helpful. Here's a quick follow-up:

💫 *How are you feeling after the consultation?*
💫 *Are you implementing the suggested remedies?*
💫 *Do you have any questions or need clarification?*

We're here to support you on your spiritual journey.

For continued guidance, contact us:
📱 WhatsApp: ${WHATSAPP_CONFIG.BUSINESS_PHONE}
📧 Email: ${WHATSAPP_CONFIG.BUSINESS_EMAIL}

*Om Namah Shivaya* 🙏
*JyotirSetu - Your Spiritual Guide* ✨`,
};

export default WHATSAPP_CONFIG;
