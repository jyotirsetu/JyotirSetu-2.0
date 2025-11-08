import type { APIRoute } from 'astro';

const getRobots = (sitemapURL: URL) => `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /admin/*
Disallow: /admin/login
Disallow: /api/
Disallow: /api/admin/
Disallow: /api/admin/*

Sitemap: ${sitemapURL.href}
Sitemap: https://follow.jyotirsetu.com/sitemap.xml
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site!);
  return new Response(getRobots(sitemapURL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};