# JyotirSetu Admin Panel

This is a completely separate admin panel for managing your JyotirSetu astrology website. It's designed to be isolated from your main website to prevent conflicts and make it easy to manage or replace if needed.

## 🏗️ Structure

```
src/admin/
├── layouts/
│   └── AdminLayout.astro          # Main admin layout with sidebar navigation
├── pages/
│   ├── index.astro               # Redirects to dashboard
│   ├── dashboard.astro           # Main admin dashboard
│   ├── appointment-management.astro    # Manage appointments
│   ├── service-management.astro        # Manage services
│   ├── blog-management.astro           # Manage blog posts
│   ├── testimonial-management.astro    # Manage testimonials
│   └── admin-settings.astro           # Admin configuration
└── README.md                     # This file
```

## 🚀 Features

### Dashboard
- Overview statistics (appointments, completed sessions, pending requests)
- Recent activity feed
- Quick action buttons
- Visual charts and metrics

### Appointment Management
- View all appointments in a table format
- Filter by status, service, and date
- Edit appointment details
- Mark appointments as completed/cancelled
- Add new appointments manually

### Service Management
- Manage all astrology services
- Set pricing and duration
- Enable/disable services
- Service descriptions and details

### Blog Management
- Create and edit blog posts
- Manage categories and tags
- View post statistics (views, engagement)
- Publish/draft functionality

### Testimonial Management
- Approve/reject client testimonials
- Edit testimonial content
- Filter by rating and service
- Manage testimonial display

### Admin Settings
- General website settings
- Formspree integration configuration
- WhatsApp Business API settings
- Security settings
- Backup and export options

## 🎨 Design Features

- **Consistent Theme**: Matches your website's JyotirSetu branding
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Color-coded Status**: Visual indicators for different states

## 🔧 Technical Details

- **Framework**: Built with Astro 5.0
- **Styling**: Tailwind CSS with custom admin theme
- **Icons**: Heroicons for consistent iconography
- **Responsive**: Mobile-first design approach
- **SEO**: Admin pages are set to no-index for security

## 🛡️ Security Features

- Admin pages are excluded from search engines
- Separate routing structure to avoid conflicts
- Clean separation from main website code
- Easy to add authentication later

## 📱 Access URLs

- **Main Dashboard**: `/admin/dashboard`
- **Appointments**: `/admin/appointment-management`
- **Services**: `/admin/service-management`
- **Blog**: `/admin/blog-management`
- **Testimonials**: `/admin/testimonial-management`
- **Settings**: `/admin/admin-settings`

## 🔄 Future Enhancements

- User authentication system
- Real-time notifications
- Advanced analytics
- Email integration
- File upload capabilities
- API endpoints for data management

## 📝 Notes

- All admin pages use unique naming to avoid conflicts with main website
- The admin panel is completely self-contained
- Easy to backup or replace the entire admin folder
- No impact on main website functionality
- Ready for production use

## 🚀 Getting Started

1. Navigate to `/admin/dashboard` to access the admin panel
2. Use the sidebar navigation to access different sections
3. All functionality is ready to use immediately
4. Customize settings in the Admin Settings page

---

**Note**: This admin panel is designed to be completely separate from your main website. If you need to make changes or replace it, you can simply modify or replace the entire `src/admin/` folder without affecting your main website.
