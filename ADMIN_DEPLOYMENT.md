# Admin Dashboard Deployment Guide

This guide lists all files required for the admin dashboard to work on a live website.

## Required Files for Admin Dashboard

### 1. Core Admin Pages (src/pages/admin/)

```
src/pages/admin/
├── login.astro                    # Admin login page
├── dashboard.astro                # Main dashboard
├── appointments.astro             # Appointments management
├── contacts.astro                 # Contacts management
├── whatsapp.astro                 # WhatsApp helper page
└── templates/
    ├── email.astro                # Email templates management
    └── whatsapp.astro             # WhatsApp templates management
```

### 2. API Routes (src/pages/api/admin/)

```
src/pages/api/admin/
├── login.ts                       # Authentication endpoint
├── logout.ts                      # Logout endpoint
├── appointments.ts                # Appointments CRUD API
├── contacts.ts                    # Contacts API
└── templates.ts                   # Templates API
```

### 3. Library Files (src/lib/)

```
src/lib/
├── auth.ts                        # Session management
├── turso.ts                       # Database client & schema
└── email-service.ts               # Email sending service
```

### 4. Middleware (src/)

```
src/middleware.ts                  # Admin route protection
```

### 5. Static Assets (public/)

```
public/
├── admin.css                      # Admin dashboard styles
└── favicon.ico                    # Favicon (copied from src/assets/favicons/)
```

### 6. Configuration Files

```
├── astro.config.ts                # Astro configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── vercel.json                    # Vercel deployment config (if using Vercel)
```

## Environment Variables Required

Set these in your hosting platform (Vercel, Netlify, etc.):

```env
# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_random_secret_key_min_32_chars

# Database (Turso)
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token

# Email Service (if using)
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=your_email@domain.com
```

## Deployment Steps

### For Vercel:

1. Push all files to your Git repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### For Other Platforms:

1. Ensure Node.js 18+ is available
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Deploy the `dist/` folder
5. Set environment variables

## Files to Exclude from Git (.gitignore)

Make sure these are NOT committed:

- `.env` (local environment file)
- `node_modules/`
- `.astro/`
- `dist/`

## Database Setup

The admin dashboard requires a Turso database:

1. Create a Turso database at https://turso.tech
2. Get your database URL and auth token
3. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables
4. Tables will be created automatically on first use

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Database connection is working
- [ ] Admin login page is accessible at `/admin/login`
- [ ] Can log in with ADMIN_USERNAME and ADMIN_PASSWORD
- [ ] Dashboard loads and shows statistics
- [ ] Can create/view appointments
- [ ] Can manage templates
- [ ] Email sending works (if configured)
- [ ] Favicon displays correctly

## Admin Theme Checklist

- [ ] `/public/admin.css` exists and is deployed
- [ ] Each admin page includes `<link rel="stylesheet" href="/admin.css?v=YYYYMMDD">`
- [ ] Cached CSS is invalidated via version query (`?v=`) after updates
- [ ] GitHub Actions deploys from `main` (merge feature branches before release)
- [ ] Hosting platform (e.g., Vercel) includes `public/` assets in build output
- [ ] No 404s for `/admin.css` or `/favicon.ico` in the Network tab

## Monitoring CSS Loading Errors

- Use browser DevTools Network panel to verify `/admin.css` status (200/304, not 404).
- In production, consider adding error reporting (e.g., Sentry) to capture resource load failures.
- Optional (dev-only): add a small script to log missing styles by checking a known computed style.
  ```html
  <!-- Example dev-only snippet for troubleshooting -->
  <script>
    if (location.hostname === 'localhost') {
      const styleApplied = getComputedStyle(document.body).backgroundColor;
      if (!styleApplied || styleApplied === 'rgba(0, 0, 0, 0)') {
        console.warn('admin.css may not be applied. Check <link> href and Network tab.');
      }
      window.addEventListener(
        'error',
        (e) => {
          console.error('Resource load error:', e);
        },
        true
      );
    }
  </script>
  ```

## Branches and CI

- CI triggers only on `main` for push and pull_request. Merge feature branches into `main` to build and deploy.
- Ensure `npm run build` succeeds and includes `public/` assets.
- If using Vercel, verify the connected branch is `main` or your production branch.

## Security Notes

1. **Never commit** `.env` files or credentials
2. Use strong `SESSION_SECRET` (32+ random characters)
3. Use strong `ADMIN_PASSWORD`
4. Consider IP whitelisting for admin routes in production
5. Enable HTTPS/SSL for all admin routes

## Troubleshooting

### Admin pages return 500 errors:

- Check environment variables are set
- Verify database connection
- Check server logs for specific errors

### Cannot log in:

- Verify ADMIN_USERNAME and ADMIN_PASSWORD are correct
- Check SESSION_SECRET is set
- Clear browser cookies and try again

### Database errors:

- Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
- Check database is accessible
- Ensure tables are created (they auto-create on first use)

## Support

For issues, check:

- Server logs
- Browser console errors
- Network tab for API errors
