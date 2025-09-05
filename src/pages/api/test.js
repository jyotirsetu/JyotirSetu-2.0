export const prerender = false;

export async function GET() {
  try {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Vercel function is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
