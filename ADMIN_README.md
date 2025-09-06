# JyotirSetu Admin Panel

## 🔐 Admin Authentication System

### **Default Credentials**
- **Username**: `admin`
- **Password**: `admin123`

### **Quick Access**
- **Admin Panel**: `http://localhost:4321/admin`
- **Login Page**: `http://localhost:4321/admin/login`
- **Credentials Reference**: `http://localhost:4321/admin/credentials`
- **Password Reset**: `http://localhost:4321/admin/forgot-password`

## 🚀 How to Use

### **1. First Time Setup**
1. Go to `http://localhost:4321/admin/credentials` to see default credentials
2. Use the credentials to login at `http://localhost:4321/admin/login`
3. **IMPORTANT**: Change the default password immediately!

### **2. Login Process**
1. Visit `http://localhost:4321/admin`
2. Enter username: `admin`
3. Enter password: `admin123` (or your new password)
4. Click "Sign In"

### **3. Change Password**
**Option A: If you know current password**
1. Login to admin panel
2. Go to Settings → Change Password
3. Enter current password and new password

**Option B: If you forgot current password**
1. Go to `http://localhost:4321/admin/forgot-password`
2. Enter username: `admin`
3. Enter new password (minimum 6 characters)
4. Confirm new password
5. Click "Reset Password"

### **4. Logout**
1. Click the "Logout" button in the sidebar
2. Confirm logout
3. You'll be redirected to login page

## 🛡️ Security Features

### **Authentication**
- ✅ Session-based authentication
- ✅ Secure HTTP-only cookies
- ✅ Route protection middleware
- ✅ Auto-redirect for unauthenticated users

### **Password Management**
- ✅ Password change with current password verification
- ✅ Password reset without current password
- ✅ Minimum 6 character requirement
- ✅ Password confirmation validation

### **Session Management**
- ✅ 7-day session duration
- ✅ Secure cookie settings
- ✅ Automatic logout functionality

## 🎨 Design Features

### **Dark Theme**
- ✅ Sophisticated dark gradient backgrounds
- ✅ Glass-morphism effects with backdrop blur
- ✅ Animated floating gradients
- ✅ Consistent blue accent colors
- ✅ High contrast text for readability

### **Responsive Design**
- ✅ Mobile-friendly layout
- ✅ Adaptive grid systems
- ✅ Touch-friendly buttons
- ✅ Optimized for all screen sizes

## 🔧 Technical Details

### **File Structure**
```
src/
├── pages/admin/
│   ├── login.astro              # Login page
│   ├── forgot-password.astro    # Password reset page
│   ├── credentials.astro        # Credentials reference
│   ├── change-password.astro    # Change password page
│   ├── dashboard.astro          # Main dashboard
│   ├── appointment-management.astro
│   ├── service-management.astro
│   ├── blog-management.astro
│   ├── testimonial-management.astro
│   ├── admin-settings.astro
│   └── api/
│       ├── login.ts             # Login API
│       ├── logout.ts            # Logout API
│       ├── change-password.ts   # Change password API
│       └── reset-password.ts    # Reset password API
├── admin/layouts/
│   └── AdminLayout.astro        # Admin layout with sidebar
└── middleware.ts                # Route protection
```

### **API Endpoints**
- `POST /admin/api/login` - User login
- `POST /admin/api/logout` - User logout
- `POST /admin/api/change-password` - Change password
- `POST /admin/api/reset-password` - Reset password

### **Session Cookies**
- `admin-session` - Session identifier
- `admin-user` - Username storage

## 🚨 Important Notes

### **Development vs Production**
- **Current Setup**: In-memory storage (development only)
- **Production Ready**: Designed for Supabase integration
- **Security**: Change default credentials before production

### **Password Storage**
- **Current**: Plain text (development only)
- **Production**: Should use proper password hashing
- **Recommendation**: Use bcrypt or similar for production

### **Session Storage**
- **Current**: Cookie-based (development only)
- **Production**: Should use database session storage
- **Recommendation**: Store sessions in Supabase

## 🔄 Next Steps

### **For Production Deployment**
1. **Set up Supabase integration**
2. **Implement proper password hashing**
3. **Add email verification for password resets**
4. **Set up proper session storage**
5. **Add two-factor authentication**
6. **Implement audit logging**

### **Additional Features**
1. **User management** (multiple admin users)
2. **Role-based permissions**
3. **Activity logging**
4. **Backup and restore functionality**
5. **Email notifications**

## 🆘 Troubleshooting

### **Can't Login**
1. Check credentials at `/admin/credentials`
2. Try password reset at `/admin/forgot-password`
3. Clear browser cookies and try again

### **Session Issues**
1. Clear browser cookies
2. Restart the development server
3. Check browser console for errors

### **Password Reset Not Working**
1. Ensure username is exactly `admin`
2. Check password meets minimum requirements (6+ characters)
3. Verify passwords match in confirmation field

## 📞 Support

For issues or questions about the admin panel:
1. Check this README first
2. Review the browser console for errors
3. Verify all files are properly saved
4. Restart the development server if needed

---

**Remember**: This is a development setup. Always change default credentials and implement proper security measures before production deployment!
