import type { APIRoute } from 'astro';
import { z } from 'zod';
import { emailService } from '../../lib/email-service';
import { getTursoClient, ensureAppointmentsTable } from '../../lib/turso';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('📝 Appointment Form API called');
    const appointmentData = await request.json();
    console.log('📊 Received appointment data:', appointmentData);

    // Verify Turnstile token only when both secret and token are present (optional during setup)
    const turnstileToken = (appointmentData['cf-turnstile-response'] || appointmentData['turnstileToken'] || '').toString();
    if (import.meta.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: import.meta.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return new Response(JSON.stringify({ success: false, message: 'Turnstile verification failed', debug: { stage: 'turnstile-verify', verifyJson } }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Validate required fields
    const Schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(6),
      service: z.string().min(2),
      date: z.string().min(4),
      time: z.string().min(1),
      consultation_method: z.string().default('call'),
      message: z.string().optional(),
      service_details: z.record(z.any()).optional(),
    });
    const parsed = Schema.safeParse(appointmentData);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid data', debug: { stage: 'validation', issues: parsed.error.flatten() } }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    console.log('✅ All required appointment fields validated');

    // Create appointment in Turso
    const mode = ((import.meta.env && import.meta.env.MODE) || process.env.NODE_ENV || 'development');
    const isDev = mode !== 'production';
    const envUrl = (((import.meta.env && import.meta.env.TURSO_DATABASE_URL) || process.env.TURSO_DATABASE_URL) || '').toString().trim();
    const envToken = (((import.meta.env && import.meta.env.TURSO_AUTH_TOKEN) || process.env.TURSO_AUTH_TOKEN) || '').toString().trim();
    const hasUrl = Boolean(envUrl);
    const hasToken = Boolean(envToken);
    if (!hasUrl || !hasToken) {
      const msg = 'Turso env vars missing (TURSO_DATABASE_URL/TURSO_AUTH_TOKEN)';
      console.error(msg, { hasUrl, hasToken });
      return new Response(JSON.stringify({ success: false, message: msg, debug: isDev ? { stage: 'env-check', hasUrl, hasToken } : undefined }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    try {
      await ensureAppointmentsTable();
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, message: 'Failed to create appointment', debug: isDev ? { stage: 'ensure-table', error: e?.message } : undefined }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    let client;
    try {
      client = await getTursoClient();
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, message: 'Failed to create appointment', debug: isDev ? { stage: 'client-init', error: e?.message } : undefined }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const id = (globalThis as any)?.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const createdAt = new Date().toISOString();
    const serviceDetails = parsed.data.service_details ? JSON.stringify(parsed.data.service_details) : null;
    const insertSql = `INSERT INTO appointments (id, name, email, phone, service, date, time, consultation_method, message, service_details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log('🗄️ Inserting appointment into Turso...');
    try {
      await client.execute({
        sql: insertSql,
        args: [
          id,
          parsed.data.name,
          parsed.data.email,
          parsed.data.phone,
          parsed.data.service,
          parsed.data.date,
          parsed.data.time,
          parsed.data.consultation_method || 'call',
          parsed.data.message || null,
          serviceDetails,
          createdAt,
        ]
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, message: 'Failed to create appointment', debug: isDev ? { stage: 'db-insert', error: e?.message } : undefined }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const newAppointment = { id, ...parsed.data, created_at: createdAt };

    console.log('📊 Appointment saved to database:', newAppointment);

    // Send confirmation email (don't fail if email fails)
    let emailSent = false;
    try {
      emailSent = await emailService.sendConfirmationEmail(parsed.data);
      console.log('📧 Appointment email service result:', emailSent);
    } catch (emailError) {
      console.warn('⚠️ Appointment email service failed, but continuing:', emailError);
      emailSent = false;
    }

    console.log('✅ Appointment created successfully');
    return new Response(JSON.stringify({
      success: true,
      data: newAppointment,
      message: emailSent 
        ? 'Appointment created successfully! You will receive a confirmation email shortly.'
        : 'Appointment created successfully! We will contact you soon.',
      emailSent: emailSent
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Appointment form creation error:', error);
    const isDev = import.meta.env.MODE !== 'production';
    // Return more specific error message
    let errorMessage = 'Failed to create appointment';
    const msg = (error?.message || '').toString().toLowerCase();
    if (msg.includes('connection') || msg.includes('network')) {
      errorMessage = 'Database connection failed. Please check Turso URL/token.';
    } else if (msg.includes('validation')) {
      errorMessage = 'Invalid data provided. Please check your input.';
    } else if (msg.includes('duplicate')) {
      errorMessage = 'An appointment with this information already exists.';
    }
    return new Response(JSON.stringify({
      success: false,
      message: errorMessage,
      debug: isDev ? { error: error?.message, stack: error?.stack } : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
