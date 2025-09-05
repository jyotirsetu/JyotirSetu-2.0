export { renderers } from '../../renderers.mjs';

const prerender = false;

async function POST({ request }) {
  try {
    console.log('📧 Email API called');
    console.log('📧 Request method:', request.method);
    console.log('📧 Request URL:', request.url);
    
    // Check if request has body
    const contentType = request.headers.get('content-type');
    console.log('📧 Content-Type:', contentType);
    
    // Get all headers for debugging
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }
    console.log('📧 All headers:', headers);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log('📧 Invalid content type, returning error');
      return new Response(JSON.stringify({
        success: false,
        error: 'Content-Type must be application/json'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get request body as text first to debug
    const bodyText = await request.text();
    console.log('📧 Raw body length:', bodyText.length);
    console.log('📧 Raw body:', bodyText);
    
    if (!bodyText || bodyText.trim() === '') {
      console.log('📧 Empty body, returning error');
      return new Response(JSON.stringify({
        success: false,
        error: 'Request body is empty'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse JSON
    let requestData;
    try {
      requestData = JSON.parse(bodyText);
      console.log('📧 Parsed data:', requestData);
    } catch (parseError) {
      console.error('📧 JSON parse error:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON in request body',
        details: parseError.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { subject, content, recipientEmail, recipientName } = requestData;
    console.log('📧 Request data:', { subject, content, recipientEmail, recipientName });
    
    // Resend configuration
    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_J7Tenr58_5Y9VdfKMnfKrLwzRh59j7nnR';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'insights@jyotirsetu.com';
    
    console.log('📧 API Key configured:', RESEND_API_KEY.length > 20);
    console.log('📧 From Email:', FROM_EMAIL);
    
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
    console.log('📧 Sending to Resend API...');
    console.log('📧 Email data:', JSON.stringify(emailData, null, 2));
    
    // Add timeout for Vercel functions
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('📧 Resend response status:', response.status);
      const result = await response.json();
      console.log('📧 Resend response:', result);
      
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('📧 Fetch error:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Request timeout - email service is slow to respond'
        }), {
          status: 408,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }
    
  } catch (error) {
    console.error('💥 Email API error:', error);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
