# YouTube Integration - Production Setup Guide

## ⚠️ Critical Issues to Prevent Repeated Problems

This document explains why your YouTube data isn't loading on production and how to fix it permanently.

---

## Problem 1: API Key Domain Restrictions

### Why Data Loads on Localhost but Not Production

YouTube API keys **require domain whitelist configuration**. If your API key only has `localhost` whitelisted, it will FAIL on production.

### ✅ Solution: Whitelist Your Production Domain

1. **Go to Google Cloud Console:**
   - URL: https://console.cloud.google.com
   - Select your project

2. **Navigate to API Credentials:**
   - Go to: `APIs & Services` → `Credentials`
   - Find your YouTube API key in the list

3. **Configure Domain Restrictions:**
   - Click on the API key
   - Scroll to "API restrictions" section
   - Select "YouTube Data API v3"
   - Click on "Application restrictions"
   - Choose: **HTTP referrers (web sites)**
   - Add these domains:
     ```
     www.jyotirsetu.com
     jyotirsetu.com
     localhost
     127.0.0.1
     [Add any other domains]
     ```

4. **Important:** Include both `www` and non-`www` versions

5. **Save and wait 5-10 minutes** for changes to propagate

---

## Problem 2: Autoplay Not Working on Production

### Why Autoplay Works on Localhost

Modern browsers have strict autoplay policies. YouTube requires **muted autoplay** on production websites.

### ✅ Solution: Use Muted Autoplay (Already Implemented)

The component now uses this embed URL format:
```
https://www.youtube.com/embed/{videoId}?rel=0&modestbranding=1&autoplay=1&mute=1&controls=1&fs=1
```

**Key Parameters:**
- `autoplay=1` - Enable autoplay
- `mute=1` - MUST be set for autoplay to work on production
- `controls=1` - Show player controls (allow user to unmute)
- `fs=1` - Allow fullscreen
- `rel=0` - Don't recommend unrelated videos
- `modestbranding=1` - Minimal YouTube branding

Users can click the unmute button in the player to hear audio.

---

## Problem 3: Data Not Loading Despite Correct API Key

### Debugging Checklist

1. **Check Browser Console:**
   - Open DevTools (F12) → Console tab
   - Look for errors like:
     - `403 Forbidden` = API key invalid or restricted
     - `403 Not Authorized` = Domain not whitelisted
     - `Timeout` = API slow or endpoint down

2. **Check Server Logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Look for messages starting with `[YouTube Component]`
   - Common errors:
     ```
     [YouTube Component] Video fetch failed: 403
     [YouTube Component] Channel API error: {error message}
     ```

3. **Verify Environment Variables:**
   - Vercel Dashboard → Project Settings → Environment Variables
   - Ensure these are set:
     ```
     PUBLIC_YOUTUBE_API_KEY=your_actual_key_here
     PUBLIC_YOUTUBE_CHANNEL_ID=UChQeWv_q0GscYKZR3RgzatQ
     ```
   - Note: `PUBLIC_` prefix means it's exposed in browser (safe for YouTube API key which needs domain restriction)

4. **Test API Key Directly:**
   - Go to: https://www.googleapis.com/youtube/v3/channels?key=YOUR_KEY&id=UChQeWv_q0GscYKZR3RgzatQ&part=snippet,statistics
   - Replace `YOUR_KEY` with your actual key
   - If you get `Forbidden` → Domain not whitelisted
   - If you get channel data → API key works

---

## Implementation Details

### Server-Side Data Fetching (Already Implemented)

The component fetches data **server-side** (on the Astro server) instead of client-side. This:
- ✅ Avoids CORS restrictions
- ✅ Keeps the API key secure
- ✅ Improves performance
- ✅ Works reliably on production

The fetches happen during page build/render:
```typescript
// Server-side fetch - runs on Vercel servers, not in browser
const videoRes = await fetch(videoApiUrl);
const channelRes = await fetch(channelApiUrl);
```

### Error Handling (Already Implemented)

The component includes professional error handling:
```typescript
// If API fails, shows graceful fallback UI
// No error messages shown to users
// All errors logged to console for debugging
```

Check browser console for `[YouTube Component]` log messages to diagnose issues.

---

## Vercel Environment Variables Setup

### Step-by-Step

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Select Your Project:** JyotirSetu

3. **Go to Settings → Environment Variables**

4. **Add or Update These Variables:**

   ```
   Key: PUBLIC_YOUTUBE_API_KEY
   Value: [Your actual YouTube API key]
   Environments: Production, Preview, Development
   ```

   ```
   Key: PUBLIC_YOUTUBE_CHANNEL_ID
   Value: UChQeWv_q0GscYKZR3RgzatQ
   Environments: Production, Preview, Development
   ```

5. **Redeploy:**
   - Go to Deployments
   - Click the latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete

---

## Security Best Practices

### API Key Safety

Your YouTube API key is safe in `PUBLIC_` environment variables because:

1. ✅ YouTube API keys require **domain restriction**
2. ✅ Key only works for domains you whitelist
3. ✅ API key is public on every website using YouTube
4. ✅ No secrets are exposed (no API tokens, keys for private data)

**DO NOT EVER** expose keys like:
- Database connection strings
- Auth tokens
- Service account keys
- API keys without domain restrictions

---

## Testing Checklist

After setup, verify:

- [ ] API key added to Vercel environment variables
- [ ] Production domain whitelisted in Google Cloud Console
- [ ] Deployment redeployed (to pick up new env vars)
- [ ] Channel info loads on production (subscriber count, title)
- [ ] Video thumbnails appear
- [ ] Featured video plays
- [ ] Autoplay works (muted, with unmute button visible)
- [ ] Subscribe button opens YouTube in new tab
- [ ] Watch Videos button works
- [ ] Check browser console for `[YouTube Component]` logs
- [ ] Check Vercel logs for errors

---

## Troubleshooting

### Scenario: "API key not configured" message
- **Cause:** Environment variable not set
- **Fix:** Add `PUBLIC_YOUTUBE_API_KEY` to Vercel environment variables

### Scenario: Thumbnail images not loading
- **Cause:** CORS or image CDN issue
- **Fix:** Check browser console, verify image URLs load directly

### Scenario: Subscribe button doesn't work
- **Cause:** Channel URL incorrect
- **Fix:** Verify `PUBLIC_YOUTUBE_CHANNEL_ID` is correct

### Scenario: Autoplay doesn't work (even muted)
- **Cause:** Browser autoplay policy or outdated YouTube parameters
- **Fix:** Check if video is actually muted, verify `mute=1` in embed URL

### Scenario: Works on localhost but not production
- **Cause:** Domain restriction, environment variable mismatch, or CORS
- **Fix:** Check all of the above; enable detailed logging

---

## Production Monitoring (Recommended)

Consider adding:

1. **Error Tracking:** Sentry, LogRocket, or Rollbar
2. **Performance Monitoring:** Vercel Analytics (built-in)
3. **Regular Audits:** Monthly check of YouTube API metrics in Google Cloud Console

---

## References

- [YouTube Data API Setup](https://developers.google.com/youtube/v3/getting-started)
- [API Key Restrictions](https://cloud.google.com/docs/authentication/api-keys)
- [YouTube Embed Parameters](https://developers.google.com/youtube/player_parameters)
- [Browser Autoplay Policy](https://developer.chrome.com/blog/autoplay/)

---

## Questions or Issues?

1. Check **browser console** for `[YouTube Component]` error messages
2. Check **Vercel logs** in deployment details
3. Verify **Google Cloud Console** for API usage and restrictions
4. Test API directly: `https://www.googleapis.com/youtube/v3/channels?key=YOUR_KEY&id=CHANNEL_ID&part=snippet,statistics`
