export async function POST({ request }) {
  try {
    const { subject, content, recipientEmail, recipientName } = await request.json();
    
    // Resend configuration
    const RESEND_API_KEY = 're_J7Tenr58_5Y9VdfKMnfKrLwzRh59j7nnR';
    const FROM_EMAIL = 'insights@jyotirsetu.com';
    
    // Validate required fields
    if (!subject || !content || !recipientEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: subject, content, recipientEmail'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Prepare email data
    const emailData = {
      from: FROM_EMAIL,
      to: [recipientEmail],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🌟 JyotirSetu</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0;">Bridge to Cosmic Light</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Hello ${recipientName || 'Valued Customer'},</h2>
            <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">${content}</div>
            <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Best regards,</strong><br>
                JyotirSetu Team<br>
                <a href="https://jyotirsetu.com" style="color: #667eea;">jyotirsetu.com</a>
              </p>
            </div>
          </div>
          <div style="background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 JyotirSetu. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return new Response(JSON.stringify({
        success: true,
        emailId: result.id,
        message: 'Email sent successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.message || 'Failed to send email',
        details: result
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Email API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
