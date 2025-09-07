import type { APIRoute } from 'astro';

// Simple in-memory admin credentials (in production, use Supabase)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // This will be hashed in production
};

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
    
    // Verify username exists (in production, verify against Supabase)
    if (username !== ADMIN_CREDENTIALS.username) {
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
    
    // Update password (in production, update in Supabase)
    ADMIN_CREDENTIALS.password = newPassword;
    
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
