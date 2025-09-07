import type { APIRoute } from 'astro';
import { verifyAdminCredentials } from '~/lib/admin-credentials';
import { generateSessionId, createSession } from '~/lib/session-management';

// This API route should be server-side rendered
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Username and password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Check credentials against database
    const isValidCredentials = await verifyAdminCredentials(username, password);
    
    if (isValidCredentials) {
      // Create session in database
      const sessionId = generateSessionId();
      const sessionCreated = await createSession(username, sessionId);
      
      if (!sessionCreated) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Failed to create session'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Create session cookie
      cookies.set('admin-session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/admin'
      });
      
      // Store username in cookie for convenience
      cookies.set('admin-user', username, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/admin'
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Login successful'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid username or password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred during login'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
