import type { APIRoute } from 'astro';
import { verifyCurrentPassword, updateAdminPassword } from '~/lib/admin-credentials';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Current password and new password are required'
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
    
    // Check if user is logged in
    const adminSession = cookies.get('admin-session');
    if (!adminSession) {
      return new Response(JSON.stringify({
        success: false,
        message: 'You must be logged in to change password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Verify current password (in production, verify against Supabase)
    if (!verifyCurrentPassword(currentPassword)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Current password is incorrect'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Update password (in production, update in Supabase)
    updateAdminPassword(newPassword);
    
    // In production, you would:
    // 1. Hash the new password
    // 2. Update the password in Supabase
    // 3. Log the password change event
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Password changed successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred while changing password'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
