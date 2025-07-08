# Email Setup Guide for Demo Booking

## ✅ Current Status
Your demo booking now works without email setup! The form will submit successfully and log the request to the console.

## 🔧 To Enable Email Notifications

### Step 1: Create .env.local file
Create a file named `.env.local` in your `my-next-app` folder:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
ADMIN_EMAIL=admin@buildstack.com

# Other existing variables...
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

### Step 2: Set up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn it on

2. **Generate App Password**
   - Go to Google Account settings
   - Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "BuildStack"
   - Copy the generated 16-character password

3. **Use the App Password**
   - Set `EMAIL_PASS=your_16_character_app_password`
   - Do NOT use your regular Gmail password

### Step 3: Restart Your Server
```bash
npm run dev
```

## 🧪 Testing

### Without Email Setup (Current)
- Demo form works ✅
- Request logged to console ✅
- No email errors ✅

### With Email Setup
- Demo form works ✅
- Admin receives notification email ✅
- User receives confirmation email ✅

## 📝 Console Logs

When you submit a demo request, you'll see logs like:
```
📝 Demo request received from John Doe (john@example.com) from ABC Construction
📊 Business Type: commercial-contractor, Volume: 1m-5m
⚠️ Email not configured - demo request logged without email notification
```

## 🔍 Troubleshooting

### If you still get email errors:
1. Check that `.env.local` file exists in `my-next-app/` folder
2. Verify `EMAIL_USER` and `EMAIL_PASS` are set correctly
3. Make sure you're using an App Password, not your regular password
4. Restart your development server after changing environment variables

### Common Issues:
- **"Missing credentials"**: Environment variables not set
- **"Invalid login"**: Using regular password instead of App Password
- **"Less secure app"**: Need to use App Password with 2FA enabled

## 🎉 Success!
Once email is configured, you'll see:
```
✅ Emails sent successfully for demo request from John Doe
```

Your demo booking system is now fully functional! 🚀 