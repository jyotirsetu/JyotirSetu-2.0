# Developer Guidelines: Avoiding Recurring Production Issues

## Purpose

This document outlines the development best practices to ensure production issues don't happen repeatedly. Follow these patterns for ALL external API integrations.

---

## 1. Environment-Specific Configuration

### ✅ Good Practice: Environment Variables for All External APIs

```typescript
// Always use environment variables, never hardcode APIs
const apiKey = import.meta.env.PUBLIC_YOUTUBE_API_KEY;
const apiUrl = import.meta.env.PUBLIC_API_URL || 'https://api.default.com';

// Log configuration on startup (for debugging)
if (!apiKey) {
  console.warn('[Module Name] API key not configured');
}
```

### ❌ Bad Practice

```typescript
// DON'T hardcode API keys or URLs
const apiKey = 'AIzaSyDjfk3jdfkjdf3j...'; // ❌ Exposed in code!
const apiUrl = 'https://localhost:3000'; // ❌ Only works locally!
```

### ✅ Vercel Environment Variable Naming

- Prefix with `PUBLIC_` if it needs to be in browser
- Use full names: `PUBLIC_YOUTUBE_CHANNEL_ID` not `YT_ID`
- Document each variable in README or deployment guide

---

## 2. Localhost vs Production Testing

### ✅ Good Practice: Test on Staging/Production Domain Early

| Test Case | Localhost | Production | Required? |
|-----------|-----------|-----------|-----------|
| API loads at all | ✓ | ? | YES - must verify |
| API data displays | ✓ | ? | YES - domain restrictions |
| Autoplay works | ✓ | ? | YES - browser policies |
| Images load | ✓ | ? | YES - CORS/redirects |
| Auth/Sessions | ✓ | ? | YES - cookie/CORS settings |

### ❌ Bad Practice: Assuming Localhost = Production Works

```typescript
// DON'T assume localhost testing is enough
// Always test with production domain before deploying
```

### Implementation

```typescript
// Always include detailed logging for production debugging
const environment = import.meta.env.MODE; // 'production', 'development'
console.log(`[YouTube Component] Running in ${environment} mode`);
console.log(`[YouTube Component] API Key configured: ${!!apiKey}`);
```

---

## 3. Error Handling & Debugging

### ✅ Good Practice: Comprehensive Error Logging

```typescript
// All external API calls should have detailed logging
try {
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    console.error(
      `[ComponentName] API failed: ${response.status} ${response.statusText}`,
      `URL: ${apiUrl}`,
      `Domain: ${new URL(apiUrl).hostname}`
    );
    apiError = `API returned ${response.status}`;
    return;
  }
  
  const data = await response.json();
  if (data.error) {
    console.error('[ComponentName] API error response:', data.error);
    apiError = `API Error: ${data.error.message}`;
    return;
  }
  
  console.log('[ComponentName] API success, loaded', data.items?.length, 'items');
} catch (err) {
  console.error('[ComponentName] Request error:', err instanceof Error ? err.message : err);
  apiError = err instanceof Error ? err.message : 'Unknown error';
}
```

### ❌ Bad Practice: Silent Failures

```typescript
// DON'T silently fail without logging
const data = await fetch(url).then(r => r.json()); // No error handling!
videos = data.items || []; // Silently fails if API down
```

---

## 4. Browser Caching & Stale Data

### ✅ Good Practice: Cache Headers in Development

```typescript
// For server-side data fetching (no caching by default)
const response = await fetch(apiUrl, {
  // Astro server-side rendering doesn't cache by default
  // But if implementing client-side fetch, add:
  // cache: 'no-store', // Don't cache
  // headers: { 'Cache-Control': 'no-cache' }
});
```

### Testing Cache Issues

```bash
# Hard refresh to bypass cache
# Chrome: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

# Check Vercel Cache Settings:
# Dashboard → Project Settings → Output → caching
```

---

## 5. CORS & Domain Restrictions

### ✅ Good Practice: Server-Side Fetching

```typescript
// BEST: Astro server-side component (runs on server)
// No CORS issues, no domain restrictions
fetch(apiUrl); // Runs on Vercel servers ✓

// API key restrictions don't affect server-side fetching
// Always use server-side when possible
```

### ❌ Bad Practice: Client-Side Fetch for Restricted APIs

```astro
// DON'T do this for YouTube API with domain restrictions
<script client:load>
  fetch(`https://www.googleapis.com/youtube/v3/...?key=${apiKey}`)
    // This fails on production due to domain restrictions!
    // Also exposes API key unnecessarily in browser
</script>
```

---

## 6. API Rate Limits & Quotas

### YouTube API Specific

```typescript
// YouTube API has quota limits:
// - Search list: ~100 requests per day (free tier)
// - Channel list: ~10,000 units per day

// Log API quota usage for monitoring
console.log('[YouTube] Fetching with quota estimate: ~40 units');

// Implement caching for repeated requests
const cacheTime = 1000 * 60 * 60; // 1 hour cache
```

### Production Monitoring

```typescript
// In production, monitor quota in Google Cloud Console
// Dashboard → APIs & Services → YouTube Data API v3
// Check "Metrics" tab for daily quota usage
```

---

## 7. Autoplay & Browser Policies

### ✅ Good Practice: Muted Autoplay for Production

```typescript
// YouTube embed parameters for production autoplay
const embedUrl = `https://www.youtube.com/embed/${videoId}?` +
  `rel=0&` +           // Don't recommend unrelated videos
  `modestbranding=1&` // Minimal branding
  `autoplay=1&` +      // Enable autoplay
  `mute=1&` +          // REQUIRED: Must be muted for autoplay
  `controls=1&` +      // Show player controls
  `fs=1`;              // Allow fullscreen
```

### Browser Autoplay Policy (2024)

- ✓ Muted autoplay: Always allowed
- ✗ Unmuted autoplay: Only if user interacted with page
- ✓ After user clicks: Can unmute

### Testing Autoplay

```bash
# Test on production domain ONLY
# Autoplay works on localhost but NOT on production domains
# This is BY DESIGN - browser security feature

# Check if video is muted
# In YouTube player, look for unmute icon
```

---

## 8. Testing Checklist for New API Integrations

Use this checklist for ANY new external API:

- [ ] API key/credentials added to `.env.example` with placeholder
- [ ] All environment variables documented in `DEPLOYMENT_GUIDE.md`
- [ ] Credentials not committed to git (in `.gitignore`)
- [ ] Error handling for 4xx, 5xx, timeout responses
- [ ] Detailed console logging with `[Component Name]` prefix
- [ ] Tested on localhost with valid credentials
- [ ] Tested on production staging domain before deployment
- [ ] Fallback UI designed for when API fails
- [ ] No hardcoded URLs or API keys anywhere
- [ ] Browser console has no errors
- [ ] Vercel logs checked for errors
- [ ] Rate limiting/quota considered
- [ ] CORS handled appropriately (server-side when possible)
- [ ] Domain restrictions configured in API provider
- [ ] Redeployment after env vars changed
- [ ] Documentation added for future developers

---

## 9. Monitoring & Alerting (Recommended)

### Add Error Tracking

```typescript
// Consider adding Sentry for production error tracking
// This helps catch issues before users report them

if (import.meta.env.PROD) {
  // Connect Sentry or similar service
  // Log API failures for monitoring
}
```

### Regular Audits

Schedule monthly checks:

1. Google Cloud Console → API quota usage
2. Vercel Dashboard → Error logs
3. Browser console in production → Any errors?
4. YouTube API → Any policy changes?

---

## 10. Code Review Checklist

When reviewing API integration code:

- [ ] No hardcoded API keys or credentials
- [ ] Environment variables used properly
- [ ] Error handling comprehensive
- [ ] Logging detailed with component name
- [ ] Localhost != production assumptions avoided
- [ ] CORS handled correctly
- [ ] Autoplay/browser policies considered
- [ ] Timeouts set for API calls
- [ ] Rate limiting thoughtful
- [ ] Documentation clear
- [ ] Tested on staging before merge

---

## Summary: Keys to prevent these issues

1. **Use environment variables** for ALL external APIs and URLs
2. **Test on staging/production domain** - not just localhost
3. **Log everything** - detailed error messages for debugging
4. **Use server-side fetching** when possible to avoid CORS
5. **Handle all error scenarios** - don't silently fail
6. **Document setup process** - so next team member doesn't struggle
7. **Monitor in production** - catch issues early
8. **Use browser DevTools** - F12 console shows real errors
9. **Read API documentation** - YouTube, Stripe, etc have specific requirements
10. **Test before deploying** - staging environment is your friend

---

## Questions?

When debugging production issues:

1. **Browser Console** (F12) → Look for error messages
2. **Vercel Logs** → Deployment details → Runtime logs
3. **API Provider Dashboard** → Check error logs, quota usage
4. **Environment Variables** → Verify they're set correctly
5. **Test API directly** → Use curl/Postman to test endpoint

This approach will save hours of debugging and prevent repeated issues.
