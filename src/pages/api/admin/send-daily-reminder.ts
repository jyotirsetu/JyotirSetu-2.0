import type { APIRoute } from 'astro';
import { sendDailyReminderEmail } from '../../../lib/daily-reminder-email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, stats } = body;

    if (!email || !stats) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Email and stats are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Invalid email format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Send the daily reminder email
    const ok = await sendDailyReminderEmail(email, stats);

    if (ok) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: 'Daily reminder email sent successfully',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Failed to send email',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Send daily reminder API error:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to send daily reminder email',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
