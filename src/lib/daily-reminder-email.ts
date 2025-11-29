import { emailService } from './email-service';

export interface DailyReminderData {
  todayAppointments: number;
  pendingAppointments: number;
  pendingContacts: number;
  pendingNewsletter: number;
  totalAppointments: number;
  totalContacts: number;
  totalNewsletter: number;
}

export async function sendDailyReminderEmail(to: string, data: DailyReminderData) {
  const subject = `📊 Daily Business Snapshot - ${new Date().toLocaleDateString()}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Business Snapshot</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: float 20s infinite linear;
        }
        
        @keyframes float {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        
        .header .date {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: #f8fafc;
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            animation: fadeInUp 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }
        
        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin: 0 auto 15px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .stat-icon.appointments {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        
        .stat-icon.pending {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }
        
        .stat-icon.contacts {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
        }
        
        .stat-icon.newsletter {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
            line-height: 1;
        }
        
        .stat-label {
            font-size: 14px;
            color: #6b7280;
            margin: 5px 0 0;
            font-weight: 500;
        }
        
        .summary-section {
            background: #f8fafc;
            border-radius: 16px;
            padding: 25px;
            margin-top: 30px;
            border: 1px solid #e2e8f0;
        }
        
        .summary-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .summary-item:last-child {
            border-bottom: none;
        }
        
        .summary-label {
            font-size: 14px;
            color: #6b7280;
        }
        
        .summary-value {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        
        .highlight {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
        }
        
        @media (max-width: 600px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .email-container {
                margin: 10px;
                border-radius: 16px;
            }
            
            .header, .content {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>📊 Daily Business Snapshot</h1>
            <div class="date">${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</div>
        </div>
        
        <div class="content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon appointments">📅</div>
                    <div class="stat-number">${data.todayAppointments}</div>
                    <div class="stat-label">Today's Appointments</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon pending">⏰</div>
                    <div class="stat-number">${data.pendingAppointments}</div>
                    <div class="stat-label">Pending Appointments</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon contacts">💬</div>
                    <div class="stat-number">${data.pendingContacts}</div>
                    <div class="stat-label">Pending Contacts</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon newsletter">📧</div>
                    <div class="stat-number">${data.pendingNewsletter}</div>
                    <div class="stat-label">Pending Newsletter</div>
                </div>
            </div>
            
            <div class="summary-section">
                <h3 class="summary-title">📈 Overall Statistics</h3>
                <div class="summary-item">
                    <span class="summary-label">Total Appointments</span>
                    <span class="summary-value">${data.totalAppointments}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Contacts</span>
                    <span class="summary-value">${data.totalContacts}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Newsletter Subscribers</span>
                    <span class="summary-value">${data.totalNewsletter}</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 12px; border: 1px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-weight: 500;">
                    💡 <span class="highlight">Pro Tip:</span> Focus on following up with pending contacts and appointments to maximize your business opportunities!
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">This is your automated daily business snapshot from JyotirSetu Admin Panel</p>
            <p class="footer-text" style="margin-top: 8px; font-size: 12px;">
                Sent with 💜 for your astrology practice success
            </p>
        </div>
    </div>
</body>
</html>
  `;

  const ok = await emailService.sendGenericHtml(to, subject, html);
  return ok;
}
