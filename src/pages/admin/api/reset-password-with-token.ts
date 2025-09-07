import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabase';
import { hashPassword } from '~/lib/admin-credentials';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token, newPassword } = await request.json();
    
    // Validate input
    if (!token || !newPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Reset token and new password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({
        success: false,
        message: 'New password must be at least 6 characters long'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if reset token exists and is valid
    const { data: adminData, error: adminError } = await supabase
      .from('admin_credentials')
      .select('username, reset_token, reset_token_expires')
      .eq('reset_token', token)
      .single();

    if (adminError || !adminData) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid or expired reset token'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(adminData.reset_token_expires);
    
    if (now > expiresAt) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Reset token has expired. Please request a new password reset.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('username', adminData.username);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to update password. Please try again.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Password has been successfully reset. You can now log in with your new password.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
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
