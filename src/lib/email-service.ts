// Email Service using Zoho Mail Send API (OAuth)
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
  service_details?: Record<string, unknown>;
  public_id?: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ZohoAccount {
  accountId: string;
  status: string;
}

export class EmailService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private region: string;
  private fromEmail: string;
  private toAdmin: string;
  private useMailChannels: boolean;
  private mailChannelsWorkerUrl?: string;
  private smtpHost?: string;
  private smtpPort?: number;
  private smtpSecure?: boolean;
  private smtpUser?: string;
  private smtpPass?: string;
  private logoUrl: string;

  constructor() {
    this.clientId = import.meta.env.ZOHO_CLIENT_ID || '';
    this.clientSecret = import.meta.env.ZOHO_CLIENT_SECRET || '';
    this.refreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || '';
    this.region = (import.meta.env.ZOHO_REGION || 'com').trim();
    this.fromEmail = import.meta.env.ZOHO_FROM_EMAIL || 'noreply@jyotirsetu.com';
    this.toAdmin = import.meta.env.ZOHO_TO_ADMIN || 'guidance@jyotirsetu.com';
    this.useMailChannels = (import.meta.env.MAILCHANNELS_ENABLED || process.env.MAILCHANNELS_ENABLED || 'false').toString().toLowerCase() === 'true';
    this.mailChannelsWorkerUrl = (import.meta.env.MAILCHANNELS_WORKER_URL || process.env.MAILCHANNELS_WORKER_URL || '').toString().trim() || undefined;

    // SMTP (Zoho) configuration
    this.smtpHost = (import.meta.env.SMTP_HOST || process.env.SMTP_HOST || '').toString().trim() || undefined;
    this.smtpPort = Number((import.meta.env.SMTP_PORT || process.env.SMTP_PORT || '').toString().trim()) || undefined;
    const secureRaw = (import.meta.env.SMTP_SECURE || process.env.SMTP_SECURE || '').toString().trim().toLowerCase();
    this.smtpSecure = secureRaw ? (secureRaw === 'true' || secureRaw === '1' || secureRaw === 'yes') : undefined;
    this.smtpUser = (import.meta.env.SMTP_USER || process.env.SMTP_USER || '').toString().trim() || undefined;
    this.smtpPass = (import.meta.env.SMTP_PASS || process.env.SMTP_PASS || '').toString().trim() || undefined;

    // Configure logo URL with fallbacks
    const siteUrlRaw = (import.meta.env.SITE_URL || process.env.SITE_URL || 'https://www.jyotirsetu.com').toString();
    const siteUrl = siteUrlRaw.replace(/\/$/, '');
    const configuredLogo = (import.meta.env.EMAIL_LOGO_URL || process.env.EMAIL_LOGO_URL || '').toString().trim();
    // Allow env override, else use the requested asset by default
    if (configuredLogo) {
      // Accept absolute or relative URLs; normalize relative to siteUrl
      this.logoUrl = configuredLogo.startsWith('http')
        ? configuredLogo
        : `${siteUrl}${configuredLogo.startsWith('/') ? '' : '/'}${configuredLogo}`;
    } else {
      this.logoUrl = `${siteUrl}/assets/images/JyotirSetu%20Astrology%20Text.png`;
    }
  }

  private resolvedLogoUrl?: string;

  // Replace occurrences of the known logo URL in img tags with a new, validated URL
  private replaceLogoUrlInHtml(html: string, newUrl: string): string {
    try {
      const pattern = new RegExp(
        String(this.logoUrl).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'g'
      );
      return html.replace(pattern, newUrl);
    } catch {
      return html;
    }
  }

  // Validate candidate URLs (configured → site asset → follow hub) and cache the first accessible
  private async getResolvedLogoUrl(): Promise<string> {
    if (this.resolvedLogoUrl) return this.resolvedLogoUrl;
    const siteUrlRaw = (import.meta.env.SITE_URL || process.env.SITE_URL || 'https://www.jyotirsetu.com').toString();
    const siteUrl = siteUrlRaw.replace(/\/$/, '');
    const configuredLogo = (import.meta.env.EMAIL_LOGO_URL || process.env.EMAIL_LOGO_URL || '').toString().trim();
    const preferredLogo = `${siteUrl}/assets/images/JyotirSetu%20Astrology%20Text.png`;
    const candidates = [preferredLogo, configuredLogo, `${siteUrl}/assets/images/Jyotirsetu-logo.png`].filter(Boolean);
    for (const url of candidates) {
      if (await this.isImageReachable(url)) {
        this.resolvedLogoUrl = url;
        return url;
      }
    }
    // Fallback to whatever is set, even if not validated
    this.resolvedLogoUrl = this.logoUrl;
    return this.logoUrl;
  }

  private async isImageReachable(url: string): Promise<boolean> {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 4000);
      const res = await fetch(url, { method: 'HEAD', signal: ac.signal });
      clearTimeout(t);
      if (!res.ok) return false;
      const ct = String(res.headers.get('content-type') || '').toLowerCase();
      return ct.includes('image');
    } catch {
      return false;
    }
  }

  private async getLogoBuffer(): Promise<Buffer | null> {
    try {
      const fs = await import('node:fs/promises');
      const tryRead = async (url: URL): Promise<Buffer | null> => {
        try {
          const buf = await fs.readFile(url);
          return Buffer.from(buf);
        } catch {
          return null;
        }
      };

      // Prefer the requested header image; fall back to existing logos
      const primaryUrl = new URL('../assets/images/JyotirSetu Astrology Text.png', import.meta.url);
      const fallbackUrl = new URL('../assets/images/Jyotirsetu-logo.png', import.meta.url);
      const fallbackUrl2 = new URL('../assets/images/JyotirSetu Full Logo Transparent.png', import.meta.url);
      const publicPrimary = new URL('../public/assets/images/JyotirSetu Astrology Text.png', import.meta.url);

      const candidates = [primaryUrl, fallbackUrl, fallbackUrl2, publicPrimary];
      for (const u of candidates) {
        const b = await tryRead(u);
        if (b) return b;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async loadEmailTemplate(key: string): Promise<{ subject: string; html: string } | null> {
    try {
      const { ensureTemplatesTables, getTursoClient } = await import('./turso');
      await ensureTemplatesTables();
      const client = await getTursoClient();
      const res = await client.execute({ sql: `SELECT subject, html FROM email_templates WHERE key = ? LIMIT 1`, args: [String(key)] });
      const row = (res.rows && res.rows[0]) as { subject?: unknown; html?: unknown } | undefined;
      if (!row) return null;
      return { subject: String(row.subject ?? ''), html: String(row.html ?? '') };
    } catch {
      return null;
    }
  }

  private replaceVars(html: string, data: AppointmentData, extras: Record<string, string> = {}, status?: string): string {
    const vars: Record<string, string> = {
      name: String(data.name || ''),
      service: String(data.service || ''),
      date: String(data.date || ''),
      time: String(data.time || ''),
      method: String(data.consultation_method || ''),
      status: String(status || ''),
      public_id: String(data.public_id || ''),
      appointment_id: String(data.public_id || ''),
      follow_link: 'https://follow.jyotirsetu.com',
      reason: String(extras.reason || ''),
      new_date: String(extras.new_date || data.date || ''),
      new_time: String(extras.new_time || data.time || ''),
    };
    return html.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
  }

  private wrapBranded(subject: string, innerHtml: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          /* Base */
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.65; color: #0f172a; max-width: 720px; margin: 0 auto; padding: 24px; background: #f6f7fb; }
          .container { background: #ffffff; border-radius: 18px; box-shadow: 0 14px 32px rgba(17,24,39,0.12); overflow: hidden; border: 1px solid #e5e7eb; }
          /* Header */
          .header { background: linear-gradient(135deg, #3f51b5 0%, #764ba2 100%); padding: 30px 22px; text-align: center; color: #fff; position: relative; }
          .header::after { content:''; position:absolute; inset:auto 0 0 0; height:3px; background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3)); }
          .logo-container { text-align:center; }
          .logo-image { display:block; margin:0 auto; border:0; outline:none; text-decoration:none; width:220px; max-width:80%; background:#ffffff; border-radius:12px; padding:8px; box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
          .tagline { margin-top:10px; font-weight:600; letter-spacing:0.4px; opacity:0.9; }
          /* Content */
          .content { padding: 26px; }
          .section-title { font-size:18px; color:#0f172a; margin:0 0 12px; }
          .card { border:1px solid #e5e7eb; border-radius:14px; padding:16px; background:#f9fafb; }
          /* Footer */
          .footer { padding: 18px 24px; border-top: 1px solid #e5e7eb; color: #334155; font-size: 13px; text-align: center; background:#fafafa; }
          .cta-link { display:inline-block; margin-top: 8px; color:#4f46e5; text-decoration:none; font-weight:600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="${this.logoUrl}" alt="JyotirSetu Logo" class="logo-image" />
            </div>
            <div class="tagline">Expert Astrological Consultations by Punita Sharma</div>
          </div>
          <div class="content">${innerHtml}</div>
          <div class="footer">
            <div>Follow updates and insights at <a class="cta-link" href="https://follow.jyotirsetu.com" target="_blank">follow.jyotirsetu.com</a></div>
            <div style="margin-top:6px">Thank you for choosing JyotirSetu</div>
          </div>
        </div>
      </body>
    </html>`;
  }

  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      throw new Error('Zoho OAuth credentials missing');
    }
    const tokenUrl = `https://accounts.zoho.${this.region}/oauth/v2/token`;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
    });
    const res = await fetch(tokenUrl, { method: 'POST', body });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Zoho token error: ${err}`);
    }
    const json = await res.json();
    return json.access_token as string;
  }

  private async getPrimaryAccountId(accessToken: string): Promise<string> {
    const res = await fetch(`https://mail.zoho.${this.region}/api/accounts`, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Zoho accounts error: ${err}`);
    }
    const json = await res.json();
    const account = json.data?.find((a: ZohoAccount) => a.status === 'active') || json.data?.[0];
    if (!account?.accountId) throw new Error('No Zoho Mail account found');
    return String(account.accountId);
  }

  private async sendViaMailChannels(to: string, subject: string, html: string): Promise<boolean> {
    // MailChannels expects from as object with email and (optional) name. We'll parse the plain email.
    const extractEmailAndName = (s: string) => {
      const match = /^(.*)<([^>]+)>\s*$/.exec(s);
      if (match) return { name: match[1].trim().replace(/"/g, ''), email: match[2].trim() };
      return { name: undefined as string | undefined, email: s.trim() };
    };
    const from = extractEmailAndName(this.fromEmail);
    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
          bcc: this.toAdmin ? [{ email: this.toAdmin }] : undefined,
        },
      ],
      from: { email: from.email, name: from.name },
      subject,
      content: [{ type: 'text/html', value: html }],
      headers: {
        'Reply-To': this.toAdmin,
      },
    };

    const endpoint = this.mailChannelsWorkerUrl || 'https://api.mailchannels.net/tx/v1/send';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      });
    if (!res.ok) {
      const text = await res.text();
      console.error('MailChannels send error:', text);
        return false;
      }
      return true;
  }

  private async sendViaSmtp(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.smtpHost || !this.smtpPort || this.smtpSecure === undefined || !this.smtpUser || !this.smtpPass) {
      throw new Error('SMTP is not fully configured');
    }
    const { default: nodemailer } = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      auth: { user: this.smtpUser, pass: this.smtpPass },
    });
    // Embed logo as CID attachment to avoid remote image blocking
    let htmlWithCid = html;
    let attachments: Array<{ filename: string; content: Buffer; cid: string }> = [];
    try {
      // First try to read the logo directly from the repo (local asset)
      const logoBuf = await this.getLogoBuffer();
      if (logoBuf) {
        // Replace occurrences of the logo URL with cid reference
        const srcPattern = new RegExp(
          String(this.logoUrl).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'g'
        );
        htmlWithCid = htmlWithCid.replace(srcPattern, 'cid:js-logo');
        attachments = [{ filename: 'logo.png', content: logoBuf, cid: 'js-logo' }];
      } else {
        // Fallback: fetch a validated remote logo URL
        const resolvedLogoUrl = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const res = await fetch(resolvedLogoUrl);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          const srcPattern = new RegExp(
            String(this.logoUrl).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'g'
          );
          htmlWithCid = htmlWithCid.replace(srcPattern, 'cid:js-logo');
          attachments = [{ filename: 'logo.png', content: buf, cid: 'js-logo' }];
        }
      }
    } catch {
      // If everything fails, fall back to original HTML without CID replacement
      htmlWithCid = html;
    }
    // Use display name if provided in env (e.g., "JyotirSetu Astrology <noreply@jyotirsetu.com>")
    const info = await transporter.sendMail({
      from: this.fromEmail,
      to,
      bcc: this.toAdmin,
      subject,
      html: htmlWithCid,
      attachments,
      replyTo: this.toAdmin,
    });
    return Boolean(info?.messageId);
  }

  private async sendViaZoho(to: string, subject: string, html: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const accountId = await this.getPrimaryAccountId(accessToken);
    // Zoho expects a plain email in fromAddress, not "Name <email>"
    const extractEmail = (s: string) => {
      const match = /<([^>]+)>/.exec(s);
      return match ? match[1] : s;
    };
    const fromPlain = extractEmail(this.fromEmail);
    // Ensure logo URL is reachable to avoid broken image in Zoho emails
    const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
    const safeHtml = this.replaceLogoUrlInHtml(html, finalLogo);
    const payload = {
      fromAddress: fromPlain,
      toAddress: to,
      subject,
      content: safeHtml,
      mailFormat: 'html',
      askReceipt: false,
      // Optionally BCC admin for delivery visibility
      ...(this.toAdmin ? { bccAddress: this.toAdmin } : {}),
    };
    const res = await fetch(`https://mail.zoho.${this.region}/api/accounts/${accountId}/messages`, {
        method: 'POST',
        headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(payload),
      });
    if (!res.ok) {
      const err = await res.text();
      console.error('Zoho send error:', err);
      return false;
    }
    return true;
  }

  async sendContactConfirmationEmail(contactData: ContactData): Promise<boolean> {
    try {
      const emailHtml = this.generateContactConfirmationEmailHTMLBranded(contactData);
      if (this.smtpHost) {
        return await this.sendViaSmtp(contactData.email, 'Thank you for contacting JyotirSetu - We\'ll be in touch soon!', emailHtml);
      }
      if (this.useMailChannels) {
        // Ensure a reachable logo URL is used for MailChannels (no CID support)
        const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const safeHtml = this.replaceLogoUrlInHtml(emailHtml, finalLogo);
        return await this.sendViaMailChannels(contactData.email, 'Thank you for contacting JyotirSetu - We\'ll be in touch soon!', safeHtml);
      }
      return await this.sendViaZoho(contactData.email, 'Thank you for contacting JyotirSetu - We\'ll be in touch soon!', emailHtml);
    } catch (error) {
      console.error('Error sending contact confirmation email:', error);
        return false;
      }
  }

  async sendConfirmationEmail(appointmentData: AppointmentData): Promise<boolean> {
    try {
      const emailHtml = this.generateAppointmentEmailHTMLV2(appointmentData);
      const subject = 'Appointment Request Confirmed - JyotirSetu';
      if (this.smtpHost) {
        return await this.sendViaSmtp(appointmentData.email, subject, emailHtml);
      }
      if (this.useMailChannels) {
        // Validate and inject accessible logo URL for MailChannels
        const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const safeHtml = this.replaceLogoUrlInHtml(emailHtml, finalLogo);
        return await this.sendViaMailChannels(appointmentData.email, subject, safeHtml);
      }
      return await this.sendViaZoho(appointmentData.email, subject, emailHtml);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  async sendNewsletterWelcomeEmail(newsletterData: { name?: string; email: string }): Promise<boolean> {
    try {
      const emailHtml = this.generateNewsletterWelcomeEmailHTML(newsletterData);
      const subject = 'Welcome to Daily Astro Tips – JyotirSetu';
      if (this.smtpHost) {
        return await this.sendViaSmtp(newsletterData.email, subject, emailHtml);
      }
      if (this.useMailChannels) {
        const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const safeHtml = this.replaceLogoUrlInHtml(emailHtml, finalLogo);
        return await this.sendViaMailChannels(newsletterData.email, subject, safeHtml);
      }
      return await this.sendViaZoho(newsletterData.email, subject, emailHtml);
    } catch (error) {
      console.error('Error sending newsletter welcome email:', error);
      return false;
    }
  }

  private generateNewsletterWelcomeEmailHTML(newsletterData: { name?: string; email: string }): string {
    const name = (newsletterData.name || 'Friend').toString();
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome – Daily Astro Tips</title>
      <style>
        /* Base */
        body { margin:0; padding:0; background:#f5f7fb; color:#0f172a; font-family: Inter, Segoe UI, Arial, sans-serif; }
        a { color:#4f46e5; text-decoration:none; }
        /* Layout (email-safe tables) */
        .outer { width:100%; background:#f5f7fb; }
        .wrap { width:100%; max-width:680px; margin:0 auto; }
        .card { background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(2,6,23,0.08); }
        /* Header */
        .hdr { background:linear-gradient(135deg,#4f46e5,#0ea5e9); color:#ffffff; padding:28px 24px; text-align:center; }
        .brand { display:inline-flex; align-items:center; gap:12px; }
        .brand img { width:40px; height:40px; border-radius:10px; background:#ffffff; }
        .brand .title { font-size:16px; font-weight:700; letter-spacing:0.2px; }
        .brand .sub { font-size:13px; opacity:0.9; }
        /* Content */
        .content { padding:28px 24px; }
        .h1 { font-size:22px; margin:0 0 8px; font-weight:800; color:#0f172a; }
        .lead { margin:8px 0 14px; line-height:1.7; color:#334155; }
        .divider { height:1px; background:#e2e8f0; margin:18px 0; }
        .benefits { background:#f8fafc; border:1px solid #e5e7eb; border-radius:14px; padding:14px 16px; }
        .benefits h3 { margin:0 0 6px; font-size:15px; color:#0f172a; }
        .benefits ul { margin:8px 0 0 18px; padding:0; color:#1f2937; }
        .benefits li { margin:6px 0; }
        .cta { display:inline-block; background:#4f46e5; color:#ffffff; padding:12px 18px; border-radius:10px; font-weight:600; box-shadow:0 8px 20px rgba(79,70,229,0.35); }
        .subnote { font-size:13px; color:#6b7280; margin-top:16px; }
        /* Footer */
        .footer { padding:20px 24px; text-align:center; color:#64748b; font-size:13px; }
        .links { margin-top:6px; }
        .links a { color:#0ea5e9; font-weight:600; }
        /* Preheader */
        .preheader { display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f5f7fb; }
      </style>
    </head>
    <body>
      <div class="preheader">You're in! Daily Astro Tips start soon + Your free guide</div>
      <table class="outer" role="presentation" cellpadding="0" cellspacing="0">
        <tr><td>
          <table class="wrap" role="presentation" cellpadding="0" cellspacing="0">
            <tr><td>
              <div class="card">
                <!-- Header -->
                <div class="hdr">
                  <span class="brand">
                    <img src="${this.logoUrl}" alt="JyotirSetu" />
                    <span>
                      <span class="title">JyotirSetu</span><br/>
                      <span class="sub">Bridge to Cosmic Light</span>
                    </span>
                  </span>
                </div>

                <!-- Body -->
                <div class="content">
                  <h1 class="h1">Welcome, ${name}! 🌟</h1>
                  <p class="lead">
                    You're all set to receive <strong>Daily Astro Tips</strong> curated by <strong>Punita Sharma</strong>.
                    Expect refined guidance, actionable remedies, and uplifting affirmations to align with planetary energies.
                  </p>
                  <div class="benefits">
                    <h3>What you'll receive</h3>
                    <ul>
                      <li>Daily insights tailored to the cosmic climate</li>
                      <li>Remedies and affirmations for clarity and balance</li>
                      <li>Occasional deep-dive guides and exclusive resources</li>
                    </ul>
                  </div>

                  <div class="divider"></div>

                  <p class="lead" style="margin-top:0;">
                    Bonus: your <strong>Dosha Balancing Guide</strong> is available in our resources.
                  </p>
                  <a class="cta" href="https://www.jyotirsetu.com/resources" target="_blank" rel="noopener">Explore Free Resources</a>

                  <p class="subnote">If this wasn’t you, or you prefer not to receive daily tips, you can unsubscribe anytime by replying to this email.</p>
                </div>

                <!-- Footer -->
                <div class="footer">
                  <div><strong>JyotirSetu</strong> — Expert Astrological Consultations</div>
                  <div class="links">
                    <a href="mailto:guidance@jyotirsetu.com" target="_blank">guidance@jyotirsetu.com</a> •
                    <a href="https://www.jyotirsetu.com" target="_blank" rel="noopener">www.jyotirsetu.com</a> •
                    <a href="https://follow.jyotirsetu.com" target="_blank" rel="noopener">Follow Hub</a>
                  </div>
                </div>
              </div>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
  }

  async sendAppointmentStatusEmail(appointmentData: AppointmentData, status: string): Promise<boolean> {
    try {
      const statusLower = String(status || '').toLowerCase();
      // Try DB template for the given status key first
      const tpl = await this.loadEmailTemplate(statusLower);
      let subject = '';
      let emailHtml = '';
      if (tpl) {
        subject = tpl.subject || `Appointment ${status} - JyotirSetu`;
        const replaced = this.replaceVars(tpl.html || '', appointmentData, {}, statusLower);
        emailHtml = this.wrapBranded(subject, replaced);
      } else {
        // Fallback to built-in generator
        emailHtml = this.generateStatusEmailHTML(appointmentData, status);
        const statusSubjects: Record<string, string> = {
          pending: 'Appointment Request Received - JyotirSetu',
          confirmed: 'Appointment Confirmed - JyotirSetu',
          rescheduled: 'Appointment Rescheduled - JyotirSetu',
          cancelled: 'Appointment Cancelled - JyotirSetu',
        };
        subject = statusSubjects[statusLower] || `Appointment ${status} - JyotirSetu`;
      }

      if (this.smtpHost) {
        return await this.sendViaSmtp(appointmentData.email, subject, emailHtml);
      }
      if (this.useMailChannels) {
        const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const safeHtml = this.replaceLogoUrlInHtml(emailHtml, finalLogo);
        return await this.sendViaMailChannels(appointmentData.email, subject, safeHtml);
      }
      return await this.sendViaZoho(appointmentData.email, subject, emailHtml);
    } catch (error) {
      console.error('Error sending status email:', error);
      return false;
    }
  }

  async sendAppointmentTemplateEmail(appointmentData: AppointmentData, templateKey: string, extras: Record<string, string> = {}): Promise<boolean> {
    try {
      const key = String(templateKey || '').toLowerCase();
      const tpl = await this.loadEmailTemplate(key);
      const subject = tpl?.subject || `Appointment ${key} - JyotirSetu`;
      const replaced = this.replaceVars((tpl?.html || ''), appointmentData, extras, key);
      const html = this.wrapBranded(subject, replaced);
      if (this.smtpHost) return await this.sendViaSmtp(appointmentData.email, subject, html);
      if (this.useMailChannels) {
        const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const safeHtml = this.replaceLogoUrlInHtml(html, finalLogo);
        return await this.sendViaMailChannels(appointmentData.email, subject, safeHtml);
      }
      return await this.sendViaZoho(appointmentData.email, subject, html);
    } catch (error) {
      console.error('Error sending template email:', error);
      return false;
    }
  }

  async sendAppointmentCustomEmail(appointmentData: AppointmentData, subject: string, innerHtml: string, extras: Record<string, string> = {}): Promise<boolean> {
    try {
      const replaced = this.replaceVars(innerHtml || '', appointmentData, extras);
      const html = this.wrapBranded(subject || 'Appointment Update - JyotirSetu', replaced);
      if (this.smtpHost) return await this.sendViaSmtp(appointmentData.email, subject, html);
      if (this.useMailChannels) {
        const finalLogo = await this.getResolvedLogoUrl().catch(() => this.logoUrl);
        const safeHtml = this.replaceLogoUrlInHtml(html, finalLogo);
        return await this.sendViaMailChannels(appointmentData.email, subject, safeHtml);
      }
      return await this.sendViaZoho(appointmentData.email, subject, html);
    } catch (error) {
      console.error('Error sending custom appointment email:', error);
      return false;
    }
  }

  private generateStatusEmailHTML(data: AppointmentData, status: string): string {
    const statusInfo: Record<string, { title: string; message: string; color: string }> = {
      'pending': { title: 'Appointment Request Received', message: 'We have received your appointment request and it is pending confirmation.', color: '#f59e0b' },
      'confirmed': { title: 'Appointment Confirmed', message: 'Your appointment has been confirmed!', color: '#22c55e' },
      'rescheduled': { title: 'Appointment Rescheduled', message: 'Your appointment has been rescheduled.', color: '#3b82f6' },
      'cancelled': { title: 'Appointment Cancelled', message: 'Your appointment has been cancelled.', color: '#ef4444' }
    };
    const info = statusInfo[status.toLowerCase()] || { title: `Appointment ${status}`, message: `Your appointment status is ${status}.`, color: '#667eea' };
    
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${info.title} - JyotirSetu</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
          .container { background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); overflow: hidden; padding: 40px 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .status-badge { display: inline-block; padding: 12px 24px; border-radius: 50px; background: ${info.color}; color: white; font-weight: 600; font-size: 18px; margin-bottom: 20px; }
          .details { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .detail-row { margin: 12px 0; display: flex; justify-content: space-between; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .appointment-id { display:inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color:#fff; padding: 6px 12px; border-radius:16px; font-family: 'Courier New', monospace; font-weight:bold; letter-spacing:1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="status-badge">${info.title}</div>
            <p>${info.message}</p>
          </div>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Appointment ID:</span>
              <span class="detail-value"><span class="appointment-id">${(data.public_id || String(data.date).replace(/-/g, '') + Math.floor(Math.random() * 1000).toString().padStart(3, '0'))}</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${data.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${data.service}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${data.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${data.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Method:</span>
              <span class="detail-value">${data.consultation_method}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing JyotirSetu!</p>
            <p>If you have any questions, please contact us.</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  // New V2 layout for ScheduleAppointment confirmations with clearer sections and friendly labels
  private generateAppointmentEmailHTMLV2(data: AppointmentData): string {
    const prettyService = String(data.service || '').replace(/^[\s\n]+|[\s\n]+$/g, '').replace(/-/g, ' ');
    const serviceName = prettyService ? prettyService.replace(/\b\w/g, (l) => l.toUpperCase()) : 'Consultation';
    const appointmentId = String(data.public_id || '').trim() || `${String(data.date || '').replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const preferredDate = (() => {
      try {
        return new Date(String(data.date)).toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
      } catch { return String(data.date || ''); }
    })();
    const bookingDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const bookingTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const msg = (String(data.message || '').trim() || 'No');

    // Map corporate service details to friendly labels if present
    const sd = (data.service_details || {}) as Record<string, unknown>;
    const labelMap: Record<string, string> = {
      companyName: 'CompanyName',
      businessType: 'BusinessType',
      employeeCount: 'EmployeeCount',
      concernArea: 'ConcernArea',
      // Career & Finance
      currentProfession: 'Current Profession',
      financialConcerns: 'Financial Concerns',
      // Study / Education
      futureGoal: 'Future Goal',
      subjectTitle: 'Subject Title',
      detailedConcern: 'Detailed Concern',
      // Relationship / Marriage
      specificFocusArea: 'Specific Focus Area',
      person1Name: 'Your Full Name',
      person1Gender: 'Your Gender',
      person1DOB: 'Your Date of Birth',
      person1TOB: 'Your Time of Birth',
      person1POB: 'Your Place of Birth',
      person2Name: "Partner's Full Name",
      person2Gender: "Partner's Gender",
      person2DOB: "Partner's Date of Birth",
      person2TOB: "Partner's Time of Birth",
      person2POB: "Partner's Place of Birth",
    };
    const serviceDetailsHtml = Object.keys(sd).length
      ? Object.entries(sd).map(([key, value]) => {
          const label = labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          return `<div><strong>${label}:</strong> ${String(value ?? '')}</div>`;
        }).join('')
      : '';

    // Build the content sections exactly as requested, wrapped in the branded shell
    const inner = `
      <div style="font-family:'Segoe UI',Tahoma,Verdana,sans-serif;color:#1f2937">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;text-align:center">Appointment Confirmed</h2>
        <div style="border:1px solid #e5e7eb;border-radius:14px;padding:18px;background:#f9fafb">
          <div style="margin-bottom:10px"><strong>Service:</strong><br/> 🔮 ${serviceName}</div>
          <div style="margin-bottom:10px"><strong>Preferred Date:</strong><br/> ${preferredDate}</div>
          <div style="margin-bottom:10px"><strong>Preferred Time:</strong><br/> ${String(data.time || '')}</div>
          <div style="margin-bottom:10px"><strong>Consultation Method:</strong><br/> ${String(data.consultation_method || '')}</div>
          <div style="margin-bottom:10px"><strong>Contact Number:</strong><br/> ${String(data.phone || '')}</div>
          <div style="margin-bottom:10px"><strong>Your Message:</strong><br/> ${msg}</div>
          ${serviceDetailsHtml ? `<div style="margin-top:12px"><strong>Service Details:</strong><br/>${serviceDetailsHtml}</div>` : ''}
        </div>

        <div style="margin-top:16px;border:1px solid #d1fae5;background:#ecfeff;border-radius:14px;padding:16px">
          <h3 style="margin:0 0 10px;font-size:16px;color:#0f766e">🔄 What Happens Next?</h3>
          <ul style="margin:0;padding-left:18px;color:#0f172a">
            <li><strong>Within 24 hours:</strong> Our team will contact you to confirm your appointment details</li>
            <li><strong>Payment:</strong> We'll discuss consultation fees and payment options</li>
            <li><strong>Preparation:</strong> You'll receive guidance on how to prepare for your consultation</li>
            <li><strong>Consultation:</strong> Your personalized astrological session with expert guidance</li>
          </ul>
        </div>

        <div style="margin-top:16px;border:1px solid #93c5fd;background:#eff6ff;border-radius:14px;padding:16px">
          <h3 style="margin:0 0 10px;font-size:16px;color:#1e40af">📋 Important Information</h3>
          <p style="margin:6px 0"><strong>⏰ Appointment ID:</strong> ${appointmentId}</p>
          <p style="margin:6px 0"><strong>📅 Booking Date:</strong> ${bookingDate}</p>
          <p style="margin:6px 0"><strong>⏱️ Booking Time:</strong> ${bookingTime}</p>
          <p style="margin:6px 0"><strong>🔮 Consultation Duration:</strong> 45-60 minutes</p>
          <p style="margin:6px 0"><strong>💰 Consultation Fee:</strong> Will be discussed during confirmation call</p>
        </div>

        <div style="margin-top:16px;border:1px solid #f59e0b;background:#fff7ed;border-radius:14px;padding:16px">
          <h3 style="margin:0 0 10px;font-size:16px;color:#92400e">🌟 What to Expect During Your Consultation</h3>
          <p style="margin:6px 0"><strong>🔍 Analysis:</strong> Deep dive into your birth chart and planetary positions</p>
          <p style="margin:6px 0"><strong>💡 Insights:</strong> Personalized guidance based on your unique astrological profile</p>
          <p style="margin:6px 0"><strong>🎯 Solutions:</strong> Practical remedies and recommendations for your life challenges</p>
          <p style="margin:6px 0"><strong>📝 Report:</strong> Detailed written summary of your consultation (if requested)</p>
          <p style="margin:6px 0"><strong>🔄 Follow-up:</strong> Post-consultation support and guidance</p>
        </div>

        <div style="margin-top:16px;border:1px solid #fde68a;background:#fffbeb;border-radius:14px;padding:16px;text-align:center">
          <h3 style="margin:0 0 10px;font-size:16px;color:#78350f">📞 Need Immediate Assistance?</h3>
          <p style="margin:8px 0">If you have any questions or need to make changes to your appointment, feel free to reach out:</p>
          <div style="margin-top:8px">
            <a href="https://wa.me/919266991298?text=Hello%20JyotirSetu,%20I%20have%20a%20question%20about%20my%20appointment" style="display:inline-block;margin:4px 8px;padding:10px 16px;border-radius:9999px;background:#25d366;color:#fff;text-decoration:none;font-weight:600">💬 WhatsApp Us</a>
            <a href="mailto:guidance@jyotirsetu.com" style="display:inline-block;margin:4px 8px;padding:10px 16px;border-radius:9999px;background:#667eea;color:#fff;text-decoration:none;font-weight:600">📧 Email Us</a>
          </div>
        </div>

        <p style="text-align:center;margin:18px 0;color:#4b5563"><em>We look forward to guiding you on your cosmic journey!</em></p>

        <div style="text-align:center;color:#111827;margin-top:8px">
          <div><strong>JyotirSetu</strong> - Bridge to Cosmic Light</div>
          <div>Expert Astrological Consultations by Punita Sharma</div>
          <div>📧 guidance@jyotirsetu.com | 🌐 www.jyotirsetu.com</div>
        </div>
      </div>
    `;

    // Use our branded wrapper to keep header/logo consistent and reliable
    return this.wrapBranded('Appointment Request Confirmed - JyotirSetu', inner);
  }

  // Branded, professional layout for contact form confirmations using the unified wrapper
  private generateContactConfirmationEmailHTMLBranded(data: ContactData): string {
    const inner = `
      <div style="font-family:'Segoe UI',Tahoma,Verdana,sans-serif;color:#1f2937">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;text-align:center">Message Received</h2>
        <div style="border:1px solid #e5e7eb;border-radius:14px;padding:18px;background:#f9fafb">
          <div style="margin-bottom:10px"><strong>Name:</strong><br/> ${String(data.name || '')}</div>
          <div style="margin-bottom:10px"><strong>Email:</strong><br/> ${String(data.email || '')}</div>
          ${data.phone ? `<div style="margin-bottom:10px"><strong>Phone:</strong><br/> ${String(data.phone)}</div>` : ''}
          <div style="margin-bottom:10px"><strong>Subject:</strong><br/> ${String(data.subject || 'General Query')}</div>
          <div style="margin-bottom:10px"><strong>Your Message:</strong><br/>
            <div style="margin-top:6px;padding:12px;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;color:#374151">${String(data.message || '')}</div>
          </div>
        </div>

        <div style="margin-top:16px;border:1px solid #d1fae5;background:#ecfeff;border-radius:14px;padding:16px">
          <h3 style="margin:0 0 10px;font-size:16px;color:#0f766e">🔄 What Happens Next?</h3>
          <ul style="margin:0;padding-left:18px;color:#0f172a">
            <li><strong>Within 24 hours:</strong> We’ll reply with guidance or next steps</li>
            <li><strong>Urgent queries:</strong> Reach us instantly on WhatsApp</li>
            <li><strong>Booking:</strong> If you want a session, we’ll share slots and fees</li>
          </ul>
        </div>

        <div style="margin-top:16px;border:1px solid #fde68a;background:#fffbeb;border-radius:14px;padding:16px;text-align:center">
          <h3 style="margin:0 0 10px;font-size:16px;color:#78350f">📞 Quick Contact</h3>
          <div style="margin-top:8px">
            <a href="https://wa.me/919266991298?text=Hello%20JyotirSetu,%20I%20have%20a%20question" style="display:inline-block;margin:4px 8px;padding:10px 16px;border-radius:9999px;background:#25d366;color:#fff;text-decoration:none;font-weight:600">💬 WhatsApp Us</a>
            <a href="mailto:guidance@jyotirsetu.com" style="display:inline-block;margin:4px 8px;padding:10px 16px;border-radius:9999px;background:#667eea;color:#fff;text-decoration:none;font-weight:600">📧 Email Us</a>
            <a href="https://www.jyotirsetu.com/ScheduleAppointmentJyotirSetu#appointment-form" style="display:inline-block;margin:4px 8px;padding:10px 16px;border-radius:9999px;background:#3f51b5;color:#fff;text-decoration:none;font-weight:600">📅 Book a Consultation</a>
          </div>
        </div>

        <p style="text-align:center;margin:18px 0;color:#4b5563"><em>We appreciate your trust in JyotirSetu.</em></p>

        <div style="text-align:center;color:#111827;margin-top:8px">
          <div><strong>JyotirSetu</strong> - Bridge to Cosmic Light</div>
          <div>Expert Astrological Consultations by Punita Sharma</div>
          <div>📧 guidance@jyotirsetu.com | 🌐 www.jyotirsetu.com</div>
        </div>
      </div>
    `;
    return this.wrapBranded("We Received Your Message - JyotirSetu", inner);
  }

  private generateContactConfirmationEmailHTML(data: ContactData): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Confirmation - JyotirSetu</title>
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
            max-width: 220px;
            height: auto;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
            transition: transform 0.3s ease;
            background:#ffffff;
            border-radius:12px;
            padding:8px;
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container" style="text-align:center;">
              <img src="${this.logoUrl}" alt="JyotirSetu Logo" class="logo-image" style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;" width="200" />
            </div>
            <p class="tagline">Bridge to Cosmic Light</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear <strong>${data.name}</strong>,
            </div>
            
            <p style="text-align: center; font-size: 16px; color: #4a5568; margin-bottom: 30px;">
              Thank you for reaching out to JyotirSetu! We have received your message and appreciate you taking the time to contact us.
            </p>
            
            <div class="divider"></div>
            
            <div class="appointment-details">
              <h3 style="margin-top: 0; color: #2d3748;">📝 Your Message Details</h3>
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${data.subject}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Message:</span>
                <span class="detail-value">${data.message}</span>
              </div>
              ${data.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${data.phone}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="next-steps">
              <h3>🔄 What Happens Next?</h3>
              <ul>
                <li><strong>Within 24 hours:</strong> Our team will review your message and respond to your inquiry</li>
                <li><strong>Personalized Response:</strong> We'll provide detailed answers to your questions</li>
                <li><strong>Follow-up:</strong> If needed, we'll schedule a consultation to discuss your concerns in detail</li>
                <li><strong>Ongoing Support:</strong> We're here to guide you on your spiritual journey</li>
              </ul>
            </div>
            
            <div class="contact-info">
              <h3 style="margin-top: 0; color: #744210;">📞 Need Immediate Assistance?</h3>
              <p>If you have any urgent questions or need immediate guidance, feel free to reach out:</p>
              <a href="https://wa.me/919266991298?text=Hello%20JyotirSetu,%20I%20have%20a%20question" class="whatsapp-btn">
                💬 WhatsApp Us
              </a>
              <a href="mailto:guidance@jyotirsetu.com" class="email-btn">
                📧 Email Us
              </a>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #4a5568;">
              <em>We look forward to connecting with you and providing the guidance you seek!</em>
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
                max-width: 220px;
                height: auto;
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                transition: transform 0.3s ease;
                background:#ffffff;
                border-radius:12px;
                padding:8px;
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
                <div class="logo-container" style="text-align:center;">
                    <img src="${this.logoUrl}" alt="JyotirSetu Logo" class="logo-image" style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;" width="200" />
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
                        <p><strong>⏰ Appointment ID:</strong> <span class="appointment-id">${(data.public_id || String(data.date).replace(/-/g, '') + Math.floor(Math.random() * 1000).toString().padStart(3, '0'))}</span></p>
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
