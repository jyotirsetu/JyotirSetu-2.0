export const get = async () => {
  // Stub favicon to avoid 404s when /favicon.ico is requested.
  // Returns 200 with empty body and correct content type.
  return new Response('', {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=86400'
    },
  });
};