import type { APIRoute } from 'astro';
import { runDatabaseSetup } from '~/lib/setup-database';

export const POST: APIRoute = async () => {
  try {
    console.log('Database setup requested...');
    
    const result = await runDatabaseSetup();
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Database setup API error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Database setup failed with error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
