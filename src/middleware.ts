import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  
  // Admin panel has been removed, so no middleware needed
  // Just continue with the request
  return next();
});
