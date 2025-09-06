import type { APIRoute } from 'astro';
import { adminDataStore } from '../../../lib/admin-data';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Check if user is logged in
    const adminSession = cookies.get('admin-session');
    if (!adminSession) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get dashboard statistics
    const stats = await adminDataStore.getDashboardStats();

    return new Response(JSON.stringify({
      success: true,
      data: stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
