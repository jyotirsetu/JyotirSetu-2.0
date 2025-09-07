import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabase';
import { generateSessionId } from '~/lib/session-management';
import { sendPasswordResetEmail } from '~/lib/email-service';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username } = await request.json();
    
    // Validate input
    if (!username) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Username is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if admin user exists
    const { data: adminData, error: adminError } = await supabase
      .from('admin_credentials')
      .select('username, email')
      .eq('username', username)
      .single();

    if (adminError || !adminData) {
      // Don't reveal if user exists or not for security
      return new Response(JSON.stringify({
        success: true,
        message: 'If the username exists, a password reset link has been sent to the registered email address.'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Generate reset token
    const resetToken = generateSessionId();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Store reset token in database
    const { error: tokenError } = await supabase
      .from('admin_credentials')
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresAt.toISOString()
      })
      .eq('username', username);

    if (tokenError) {
      console.error('Error storing reset token:', tokenError);
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to generate reset token. Please try again.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Create reset link - use localhost for development, production domain for production
    const baseUrl = import.meta.env.DEV 
      ? 'http://localhost:4322' 
      : (import.meta.env.SITE || 'https://www.jyotirsetu.com');
    const resetLink = `${baseUrl}/admin/reset-password?token=${resetToken}`;

    // Send email with reset link
    try {
      await sendPasswordResetEmail(adminData.email, resetLink);
      console.log('Password reset email sent to:', adminData.email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't reveal email sending failure to user for security
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'If the username exists, a password reset link has been sent to the registered email address.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred. Please try again later.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
