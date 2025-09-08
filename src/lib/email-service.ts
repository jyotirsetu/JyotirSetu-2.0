// Email Service using Resend API
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  consultation_method: string;
  message?: string;
  service_details?: Record<string, any>;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = import.meta.env.RESEND_API_KEY || '';
    this.fromEmail = import.meta.env.FROM_EMAIL || 'JyotirSetu <noreply@jyotirsetu.com>';
  }

  async sendConfirmationEmail(appointmentData: AppointmentData): Promise<boolean> {
    try {
      const emailHtml = this.generateConfirmationEmailHTML(appointmentData);
      
      const emailData: EmailData = {
        to: appointmentData.email,
        subject: 'Appointment Request Confirmed - JyotirSetu',
        html: emailHtml,
        from: this.fromEmail
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  private generateConfirmationEmailHTML(data: AppointmentData): string {
    const serviceEmojis: Record<string, string> = {
      'kundli-analysis': '🔮',
      'palmistry': '✋',
      'matchmaking': '💕',
      'numerology': '🔢',
      'gemstone-consultation': '💎',
      'career-finance': '💼',
      'spiritual-guidance': '🕉️',
      'remedial-solutions': '🛡️',
      'dosha-analysis': '⚖️'
    };

    const serviceEmoji = serviceEmojis[data.service] || '🔮';
    const serviceName = data.service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return `
      <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation - JyotirSetu</title>
        <style>
          body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
                max-width: 650px;
            margin: 0 auto;
            padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
          }
          .container {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                position: relative;
            }
            .container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
          }
          .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            .logo-container {
                margin-bottom: 15px;
                position: relative;
                z-index: 1;
            }
            .logo-image {
                max-width: 200px;
                height: auto;
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                transition: transform 0.3s ease;
            }
            .logo-image:hover {
                transform: scale(1.05);
            }
            .tagline {
                font-size: 18px;
                font-weight: 300;
                opacity: 0.95;
                position: relative;
                z-index: 1;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                letter-spacing: 1px;
                text-transform: uppercase;
                background: linear-gradient(45deg, #ffffff, #f0f9ff, #e0f2fe);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: shimmer 3s ease-in-out infinite;
            }
            @keyframes shimmer {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 20px;
                margin-bottom: 25px;
                color: #2d3748;
            text-align: center;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 600;
            }
            .appointment-details {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                border-left: 5px solid #667eea;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
                position: relative;
            }
            .appointment-details::before {
                content: '✨';
                position: absolute;
                top: -10px;
                right: 20px;
                font-size: 24px;
                background: white;
                padding: 5px 10px;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .detail-row {
            display: flex;
                justify-content: space-between;
            align-items: center;
                margin-bottom: 15px;
                padding: 12px 0;
                border-bottom: 1px solid #e2e8f0;
                transition: all 0.3s ease;
            }
            .detail-row:hover {
                background: rgba(102, 126, 234, 0.05);
                border-radius: 8px;
                padding-left: 10px;
                padding-right: 10px;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #4a5568;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .detail-value {
                color: #2d3748;
                font-weight: 500;
            }
            .service-badge {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .next-steps {
                background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
                border: 2px solid #81e6d9;
            border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(129, 230, 217, 0.2);
            }
            .next-steps h3 {
                color: #234e52;
                margin-top: 0;
                font-size: 18px;
                text-align: center;
            }
            .next-steps ul {
                color: #2d3748;
                padding-left: 20px;
            }
            .next-steps li {
                margin-bottom: 10px;
                position: relative;
            }
            .next-steps li::marker {
                color: #38b2ac;
                font-size: 18px;
            }
            .contact-info {
                background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
                border: 2px solid #f6e05e;
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                text-align: center;
                box-shadow: 0 4px 15px rgba(246, 224, 94, 0.2);
            }
            .contact-info h3 {
                margin-top: 0;
                color: #744210;
                font-size: 18px;
            }
            .footer {
                background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
                padding: 30px 20px;
                text-align: center;
                font-size: 14px;
                position: relative;
            }
            .footer::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            }
            .whatsapp-btn, .email-btn {
            padding: 15px 30px;
                border-radius: 25px;
            text-decoration: none;
                display: inline-block;
                margin: 10px 8px;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .whatsapp-btn {
                background: linear-gradient(135deg, #25d366, #128c7e);
                color: white;
            }
            .whatsapp-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
            }
            .email-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }
            .email-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                margin: 30px 0;
            }
            .highlight-box {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 2px solid #f59e0b;
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
            }
            .highlight-box h3 {
                margin-top: 0;
            color: #92400e;
                font-size: 18px;
                text-align: center;
            }
            .info-box {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border: 2px solid #0ea5e9;
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);
            }
            .info-box h3 {
                margin-top: 0;
                color: #0c4a6e;
                font-size: 18px;
            text-align: center;
          }
            .appointment-id {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                display: inline-block;
                letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="container">
            <div class="header">
                <div class="logo-container">
                    <img src="https://www.jyotirsetu.com/JyotirSetu%20Full%20Logo%20Transparent.png" alt="JyotirSetu Logo" class="logo-image" />
                </div>
                <p class="tagline">Bridge to Cosmic Light</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Dear <strong>${data.name}</strong>,
          </div>
          
                <p style="text-align: center; font-size: 16px; color: #4a5568; margin-bottom: 30px;">
                    Thank you for choosing JyotirSetu for your astrological consultation! We have received your appointment request and are excited to help you discover the cosmic insights that await you.
                </p>
                
                <div class="divider"></div>
                
                <div class="appointment-details">
                    <h3 style="margin-top: 0; color: #2d3748;">📅 Your Appointment Details</h3>
                    <div class="detail-row">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">
                            <span class="service-badge">${serviceEmoji} ${serviceName}</span>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Preferred Date:</span>
                        <span class="detail-value">${new Date(data.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Preferred Time:</span>
                        <span class="detail-value">${data.time}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Consultation Method:</span>
                        <span class="detail-value">${data.consultation_method}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Contact Number:</span>
                        <span class="detail-value">${data.phone}</span>
                    </div>
                    ${data.message ? `
                    <div class="detail-row">
                        <span class="detail-label">Your Message:</span>
                        <span class="detail-value">${data.message}</span>
                    </div>
                    ` : ''}
                    ${data.service_details ? `
                    <div class="detail-row">
                        <span class="detail-label">Service Details:</span>
                        <span class="detail-value">
                            ${Object.entries(data.service_details).map(([key, value]) => 
                                `<div style="margin: 5px 0;"><strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${value}</div>`
                            ).join('')}
                        </span>
                    </div>
                    ` : ''}
          </div>
          
                <div class="next-steps">
                    <h3>🔄 What Happens Next?</h3>
                    <ul>
                        <li><strong>Within 24 hours:</strong> Our team will contact you to confirm your appointment details</li>
                        <li><strong>Payment:</strong> We'll discuss consultation fees and payment options</li>
                        <li><strong>Preparation:</strong> You'll receive guidance on how to prepare for your consultation</li>
                        <li><strong>Consultation:</strong> Your personalized astrological session with expert guidance</li>
            </ul>
          </div>
          
                <div class="info-box">
                    <h3>📋 Important Information</h3>
                    <div style="color: #0c4a6e;">
                        <p><strong>⏰ Appointment ID:</strong> <span class="appointment-id">${data.service.toUpperCase().substring(0,3)}${data.date.replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</span></p>
                        <p><strong>📅 Booking Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                        <p><strong>⏱️ Booking Time:</strong> ${new Date().toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}</p>
                        <p><strong>🔮 Consultation Duration:</strong> 45-60 minutes</p>
                        <p><strong>💰 Consultation Fee:</strong> Will be discussed during confirmation call</p>
                    </div>
                </div>
                
                <div class="highlight-box">
                    <h3>🌟 What to Expect During Your Consultation</h3>
                    <div style="color: #92400e;">
                        <p><strong>🔍 Analysis:</strong> Deep dive into your birth chart and planetary positions</p>
                        <p><strong>💡 Insights:</strong> Personalized guidance based on your unique astrological profile</p>
                        <p><strong>🎯 Solutions:</strong> Practical remedies and recommendations for your life challenges</p>
                        <p><strong>📝 Report:</strong> Detailed written summary of your consultation (if requested)</p>
                        <p><strong>🔄 Follow-up:</strong> Post-consultation support and guidance</p>
                    </div>
                </div>
                
                <div class="contact-info">
                    <h3 style="margin-top: 0; color: #744210;">📞 Need Immediate Assistance?</h3>
                    <p>If you have any questions or need to make changes to your appointment, feel free to reach out:</p>
                    <a href="https://wa.me/919266991298?text=Hello%20JyotirSetu,%20I%20have%20a%20question%20about%20my%20appointment" class="whatsapp-btn">
                        💬 WhatsApp Us
                    </a>
                    <a href="mailto:guidance@jyotirsetu.com" class="email-btn">
                        📧 Email Us
                    </a>
                </div>
                
                <p style="text-align: center; margin-top: 30px; color: #4a5568;">
                    <em>We look forward to guiding you on your cosmic journey!</em>
                </p>
            </div>
          
            <div class="footer">
                <p><strong>JyotirSetu</strong> - Bridge to Cosmic Light</p>
                <p>Expert Astrological Consultations by Punita Sharma</p>
                <p>📧 guidance@jyotirsetu.com | 🌐 www.jyotirsetu.com</p>
            </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
