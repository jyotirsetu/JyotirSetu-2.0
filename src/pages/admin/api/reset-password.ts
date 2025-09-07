import type { APIRoute } from 'astro';
import { updateAdminPassword, getAdminCredentials } from '~/lib/admin-credentials';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, newPassword } = await request.json();
    
    // Validate input
    if (!username || !newPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Username and new password are required'
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
    
    // Verify username exists in database
    const adminData = await getAdminCredentials(username);
    if (!adminData) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid username'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Update password in database
    const passwordUpdated = await updateAdminPassword(username, newPassword);
    if (!passwordUpdated) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to reset password'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // In production, you would:
    // 1. Hash the new password
    // 2. Update the password in Supabase
    // 3. Log the password reset event
    // 4. Send email notification if configured
    
    console.log(`Password reset for user: ${username}`);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset successfully'
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
      message: 'An error occurred while resetting password'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
