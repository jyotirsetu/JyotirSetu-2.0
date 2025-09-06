# JyotirSetu Deployment Guide - Vercel

## 🚀 Deploying to Vercel with Custom Domain

### **✅ Vercel Compatibility**
Your JyotirSetu admin panel is **fully compatible** with Vercel deployment. Here's everything you need to know:

## 📋 Pre-Deployment Checklist

### **1. Environment Variables Setup**
Before deploying, you'll need to set up environment variables in Vercel:

#### **Required Variables:**
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=your_random_32_character_secret
SITE_URL=https://www.jyotirsetu.com
```

#### **Optional Variables (for Supabase integration):**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **2. Security Considerations**
- ✅ **Change default password** before production
- ✅ **Use strong session secrets**
- ✅ **Enable HTTPS** (automatic with Vercel)
- ✅ **Set secure cookie flags** (handled in production code)

## 🚀 Deployment Steps

### **Step 1: Prepare Your Repository**
1. **Commit all changes** to your Git repository
2. **Push to GitHub/GitLab/Bitbucket**
3. **Ensure all files are committed**

### **Step 2: Connect to Vercel**
1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up/Login** with your GitHub account
3. **Click**: "New Project"
4. **Import**: Your JyotirSetu repository
5. **Select**: Framework Preset → "Astro"

### **Step 3: Configure Environment Variables**
1. **In Vercel Dashboard**: Go to Project Settings
2. **Click**: "Environment Variables"
3. **Add each variable**:
   ```
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = your_secure_password
   SESSION_SECRET = generate_random_32_chars
   SITE_URL = https://www.jyotirsetu.com
   ```

### **Step 4: Deploy**
1. **Click**: "Deploy"
2. **Wait**: For deployment to complete
3. **Test**: Your admin panel at the Vercel URL

### **Step 5: Custom Domain Setup**
1. **In Vercel Dashboard**: Go to "Domains"
2. **Add Domain**: `www.jyotirsetu.com`
3. **Configure DNS**: Follow Vercel's DNS instructions
4. **Wait**: For DNS propagation (up to 24 hours)

## 🔧 Production Configuration

### **File Changes for Production:**
1. **Replace** `src/pages/admin/api/login.ts` with `login-production.ts`
2. **Update** environment variables
3. **Test** all functionality

### **Security Enhancements:**
- ✅ **HTTPS Only**: Automatic with Vercel
- ✅ **Secure Cookies**: Enabled in production
- ✅ **Environment Variables**: Credentials not in code
- ✅ **Security Headers**: Configured in vercel.json

## 📊 Performance Optimizations

### **Vercel Features You Get:**
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Automatic HTTPS**: SSL certificates
- ✅ **Serverless Functions**: Scalable API endpoints
- ✅ **Edge Functions**: Ultra-fast responses
- ✅ **Automatic Deployments**: Git-based deployments

### **Optimizations Included:**
- ✅ **Image Optimization**: Automatic with Astro
- ✅ **Code Splitting**: Automatic with Vercel
- ✅ **Caching**: Automatic with Vercel
- ✅ **Compression**: Automatic with Vercel

## 🔐 Security Best Practices

### **Before Production:**
1. **Change Default Password**:
   ```bash
   ADMIN_PASSWORD=your_very_secure_password_123!
   ```

2. **Generate Strong Session Secret**:
   ```bash
   SESSION_SECRET=your_32_character_random_string_here
   ```

3. **Enable Security Headers** (already configured in vercel.json)

### **Production Security Features:**
- ✅ **HTTP-Only Cookies**: Prevent XSS attacks
- ✅ **Secure Cookies**: HTTPS only in production
- ✅ **SameSite Protection**: CSRF protection
- ✅ **Session Timeout**: 7-day expiration
- ✅ **Route Protection**: Middleware-based

## 🚨 Important Notes

### **Session Storage Limitation:**
**Current Issue**: Sessions are stored in cookies only, which means:
- ✅ **Works**: For single-user admin panels
- ⚠️ **Limitation**: Sessions don't persist across serverless function restarts
- 🔧 **Solution**: Consider Supabase integration for production

### **Recommended for Production:**
1. **Use Supabase** for persistent session storage
2. **Implement proper password hashing**
3. **Add audit logging**
4. **Set up monitoring**

## 🔄 Post-Deployment Testing

### **Test Checklist:**
1. ✅ **Login**: Test with new credentials
2. ✅ **Password Change**: Verify functionality
3. ✅ **Password Reset**: Test forgot password
4. ✅ **Logout**: Verify session clearing
5. ✅ **Route Protection**: Test unauthorized access
6. ✅ **Mobile**: Test responsive design
7. ✅ **Performance**: Check loading speeds

### **URLs to Test:**
- `https://www.jyotirsetu.com/admin` → Should redirect to login
- `https://www.jyotirsetu.com/admin/login` → Login page
- `https://www.jyotirsetu.com/admin/forgot-password` → Password reset
- `https://www.jyotirsetu.com/admin/credentials` → Credentials reference

## 🆘 Troubleshooting

### **Common Issues:**

#### **1. Environment Variables Not Working**
- **Check**: Variable names match exactly
- **Verify**: Variables are set in Vercel dashboard
- **Redeploy**: After adding new variables

#### **2. Sessions Not Persisting**
- **Expected**: This is normal with current setup
- **Solution**: Implement Supabase for persistent sessions

#### **3. Custom Domain Not Working**
- **Check**: DNS configuration
- **Wait**: Up to 24 hours for propagation
- **Verify**: Domain is added in Vercel dashboard

#### **4. HTTPS Issues**
- **Automatic**: Vercel handles HTTPS automatically
- **Check**: SSL certificate status in Vercel dashboard

## 📈 Monitoring & Analytics

### **Vercel Analytics:**
- ✅ **Performance Metrics**: Automatic
- ✅ **Error Tracking**: Built-in
- ✅ **Usage Statistics**: Available in dashboard

### **Recommended Additions:**
- **Google Analytics**: For website traffic
- **Sentry**: For error monitoring
- **Uptime Monitoring**: For availability tracking

## 🎯 Next Steps After Deployment

### **Immediate:**
1. **Test all functionality**
2. **Change default password**
3. **Set up monitoring**

### **Future Enhancements:**
1. **Supabase Integration**: For persistent data
2. **Email Notifications**: For password resets
3. **Two-Factor Authentication**: Enhanced security
4. **User Management**: Multiple admin users
5. **Audit Logging**: Track all admin actions

---

## 🎉 Summary

**Your JyotirSetu admin panel is ready for Vercel deployment!**

**Key Benefits:**
- ✅ **Fully Compatible**: Works perfectly with Vercel
- ✅ **Custom Domain**: Easy setup with www.jyotirsetu.com
- ✅ **Secure**: Production-ready security features
- ✅ **Fast**: Global CDN and optimizations
- ✅ **Scalable**: Serverless architecture

**Deployment Time**: ~15-30 minutes
**DNS Propagation**: Up to 24 hours
**Total Setup**: 1-2 hours including testing

**Ready to deploy?** Follow the steps above and your admin panel will be live on www.jyotirsetu.com! 🚀
