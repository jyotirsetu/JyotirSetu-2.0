import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  // Redirect to external blog RSS feed
  return new Response(null, {
    status: 302,
    headers: {
      Location: 'https://www.blog.jyotirsetu.com/rss.xml'
    }
  });
};
