# 🚀 WhatsApp Setup Checklist - JyotirSetu

## ✅ **Step-by-Step Setup Guide**

### **Phase 1: Facebook Developer Setup (15 minutes)**

- [ ] **1. Go to** [Facebook Developers](https://developers.facebook.com/)
- [ ] **2. Sign in** with your Facebook account
- [ ] **3. Click "Create App"**
- [ ] **4. Select "Business"** as app type
- [ ] **5. Enter App Name**: `JyotirSetu Astrology`
- [ ] **6. Enter Business Email**: `guidance@jyotirsetu.com`
- [ ] **7. Click "Create App"**

### **Phase 2: WhatsApp Business Setup (10 minutes)**

- [ ] **8. Click "Add Product"**
- [ ] **9. Find "WhatsApp"** and click "Set Up"
- [ ] **10. Click "Add Phone Number"**
- [ ] **11. Select India** as country
- [ ] **12. Choose a phone number** (this will be your business WhatsApp)
- [ ] **13. Verify the number** via SMS/call
- [ ] **14. Note down Phone Number ID** (you'll need this!)

### **Phase 3: Get Access Token (5 minutes)**

- [ ] **15. Go to "System Users"** in app dashboard
- [ ] **16. Create new system user**
- [ ] **17. Assign WhatsApp permissions**
- [ ] **18. Generate access token**
- [ ] **19. Copy the access token** (keep it secure!)

### **Phase 4: Update Configuration (2 minutes)**

- [ ] **20. Open** `src/config/whatsapp-config.js`
- [ ] **21. Replace** `your_access_token_here` with your actual token
- [ ] **22. Replace** `your_phone_number_id_here` with your actual Phone Number ID

### **Phase 5: Configure Formspree Webhook (5 minutes)**

- [ ] **23. Go to** [Formspree Dashboard](https://formspree.io/forms)
- [ ] **24. Find form** `xnnbzveo`
- [ ] **25. Go to Settings → Webhooks**
- [ ] **26. Add new webhook**:
    - **URL**: `https://yourdomain.com/api/whatsapp-simple`
    - **Events**: `form.submitted`
    - **Method**: POST

### **Phase 6: Test Everything (5 minutes)**

- [ ] **27. Submit test form** on your website
- [ ] **28. Check your email** (admin notification)
- [ ] **29. Check WhatsApp** (user confirmation)
- [ ] **30. Verify webhook logs** in Formspree

---

## 🎯 **What You'll Get After Setup:**

✅ **FREE WhatsApp confirmations** (1000/month)  
✅ **Professional business WhatsApp** appearance  
✅ **Instant user notifications** with all appointment details  
✅ **Beautiful message templates** with your branding  
✅ **Email notifications** to you (as before)  
✅ **Mobile-optimized** experience  

---

## 🚨 **Important Notes:**

- **Keep your access token secure** - don't share it publicly
- **Phone Number ID** is different from the actual phone number
- **Test with your own number first** before going live
- **WhatsApp Business API is FREE** for 1000 messages/month
- **No SMS costs** - everything is free!

---

## 📞 **Need Help?**

If you get stuck at any step:
1. **Check the detailed guide** in `WHATSAPP_SETUP.md`
2. **Review Facebook Developer documentation**
3. **Test webhook endpoint** directly
4. **Check browser console** for errors

---

## 🎉 **You're Almost There!**

Once you complete this checklist, your appointment form will:
- 📧 **Send you email notifications**
- 📱 **Send users WhatsApp confirmations**
- 💰 **Cost you absolutely nothing**
- 🚀 **Look professional and modern**

**Start with Phase 1 and let me know when you're ready for the next step!** 🎯✨
