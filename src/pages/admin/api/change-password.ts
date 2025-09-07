import type { APIRoute } from 'astro';

// Simple in-memory admin credentials (in production, use Supabase)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // This will be hashed in production
};

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
    if (currentPassword !== ADMIN_CREDENTIALS.password) {
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
    ADMIN_CREDENTIALS.password = newPassword;
    
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
