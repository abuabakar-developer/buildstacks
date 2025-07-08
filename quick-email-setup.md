# 🚀 Quick Email Setup for BuildStack

## ⚠️ Current Issue
Your invitation emails are not being sent because email credentials are missing.

## ✅ Solution: Add Email Credentials

### Step 1: Open your `.env.local` file
In your `my-next-app` folder, open the `.env.local` file

### Step 2: Add these lines to your `.env.local` file:

```env
# Add these lines to your existing .env.local file:

# Nodemailer Configuration (Gmail)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=your_gmail_address@gmail.com
```

### Step 3: Get Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" → "2-Step Verification" → "App passwords"
3. Select "Mail" and click "Generate"
4. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### Step 4: Example Configuration
```env
# Your existing Stripe config
STRIPE_SECRET_KEY=sk_test_...

# Add these new lines:
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=john.doe@gmail.com
```

### Step 5: Restart Your Server
```bash
# Stop your server (Ctrl+C) then restart:
npm run dev
```

## 🎯 What Will Happen After Setup

✅ **Before:** Terminal shows "Email credentials not configured"
✅ **After:** Terminal shows "✅ Email sent successfully"

✅ **Before:** Users don't receive invitation emails
✅ **After:** Users receive beautiful professional invitation emails

## 📧 Email Preview
Users will receive emails like this:

**Subject:** "You're invited to join [Project Name] on BuildStack!"

**Content:**
- Professional BuildStack branding
- Clear "Accept Invitation" button
- List of features they'll get access to
- Construction-focused content

## 🔧 Troubleshooting

**If you still see "Missing credentials" error:**
- Make sure you're using the App Password, not your regular Gmail password
- Remove any spaces from the App Password
- Restart your development server after adding credentials

**If you get "Invalid login" error:**
- Make sure 2-factor authentication is enabled on your Gmail
- Generate a new App Password
- Double-check your email address 