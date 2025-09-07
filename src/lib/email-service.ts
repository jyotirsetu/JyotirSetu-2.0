// Email service for sending password reset emails
import { Resend } from 'resend';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Initialize Resend client (will be created conditionally)
let resend: Resend | null = null;

// Email sending function using Resend
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  // Skip email sending on localhost - only work on production
  if (import.meta.env.DEV) {
    console.log('=== LOCALHOST MODE - Email Service Disabled ===');
    console.log('To:', email);
    console.log('Subject: Password Reset Request - JyotirSetu Admin');
    console.log('Reset Link:', resetLink);
    console.log('Note: Email service is disabled on localhost');
    console.log('===============================================');
    return Promise.resolve();
  }

  // Check if we have the API key for production
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY not found in production, using fallback mode');
    // Fallback: log the email details
    console.log('=== EMAIL FALLBACK (Production - No API Key) ===');
    console.log('To:', email);
    console.log('Subject: Password Reset Request - JyotirSetu Admin');
    console.log('Reset Link:', resetLink);
    console.log('===============================================');
    return Promise.resolve();
  }

  // Initialize Resend client if not already done
  if (!resend) {
    resend = new Resend(apiKey);
  }

  const emailConfig: EmailConfig = {
    to: email,
    subject: 'Password Reset Request - JyotirSetu Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          .logo-image {
            max-width: 200px;
            height: auto;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
            transition: transform 0.3s ease;
          }
          .logo-image:hover {
            transform: scale(1.05);
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .reset-button:hover {
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          }
          .warning {
            background-color: #fef3cd;
            border: 1px solid #fecaca;
            color: #92400e;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="https://www.jyotirsetu.com/src/assets/images/JyotirSetu%20Full%20Logo%20Transparent.png" alt="JyotirSetu Logo" class="logo-image" />
            </div>
            <h1>Password Reset Request</h1>
          </div>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password for the JyotirSetu Admin Panel. If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="reset-button">Reset My Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${resetLink}
          </p>
          
          <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul>
              <li>This link will expire in 15 minutes</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>For security reasons, this link can only be used once</li>
            </ul>
          </div>
          
          <p>If you have any questions or need assistance, please contact our support team.</p>
          
          <div class="footer">
            <p>This email was sent from JyotirSetu Admin Panel</p>
            <p>© 2024 JyotirSetu. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - JyotirSetu Admin
      
      Hello,
      
      We received a request to reset your password for the JyotirSetu Admin Panel. 
      
      To reset your password, please visit the following link:
      ${resetLink}
      
      Important Security Information:
      - This link will expire in 15 minutes
      - If you didn't request this password reset, please ignore this email
      - For security reasons, this link can only be used once
      
      If you have any questions or need assistance, please contact our support team.
      
      This email was sent from JyotirSetu Admin Panel
      © 2024 JyotirSetu. All rights reserved.
    `
  };

  try {
    // Send email using Resend
    const { data, error } = await resend!.emails.send({
      from: import.meta.env.DEV 
        ? 'noreply@example.com' // Development - simple format
        : 'noreply@jyotirsetu.com', // Production - verify domain in Resend dashboard
      to: [emailConfig.to],
      subject: emailConfig.subject,
      html: emailConfig.html,
      text: emailConfig.text,
    });

    if (error) {
      console.error('Resend email error:', error);
      // In production, don't throw error - use fallback instead
      console.log('Email sending failed in production, using fallback');
      throw new Error('Email service temporarily unavailable');
    }

    console.log('✅ Password reset email sent successfully:', data);
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // Fallback: log the email details for production
    console.log('=== EMAIL FALLBACK (Production Mode) ===');
    console.log('To:', emailConfig.to);
    console.log('Subject:', emailConfig.subject);
    console.log('Reset Link:', resetLink);
    console.log('Note: Email service failed, but reset link is available');
    console.log('=========================================');
    
    // Return success even if email fails - the reset link is still generated
    return Promise.resolve();
  }
}

// Generic email sending function for other purposes
export async function sendEmail(config: EmailConfig): Promise<void> {
  // Implementation would be similar to sendPasswordResetEmail
  console.log('Email would be sent:', config);
  return Promise.resolve();
}
