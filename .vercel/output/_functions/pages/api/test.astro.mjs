export { renderers } from '../../renderers.mjs';

const prerender = false;

async function GET() {
  try {
    return new Response(JSON.stringify({
      success: true,
      message: 'Vercel function is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
