# OTP Email Verification Setup Guide

This guide explains how to set up email verification with OTP (One-Time Password) for WorkNest registration and login.

## Features Implemented

✅ **Email Verification for Registration**

- Users must verify their email with OTP before account creation
- Prevents fake email registrations
- 6-digit OTP sent via email

✅ **OTP Login Option**

- Users can login using OTP instead of password
- Secure alternative authentication method
- Same email verification process

✅ **Security Features**

- OTP expires in 10 minutes
- Maximum 5 verification attempts per OTP
- Rate limiting: Can't request new OTP until previous expires
- OTPs are automatically deleted after successful verification

## Required Tools & Packages

### Backend Dependencies

- **nodemailer** - For sending emails
  ```bash
  cd backend
  npm install nodemailer
  ```

### Frontend Dependencies

- No additional packages required (uses existing React components)

## Email Service Configuration

### Step 1: Set Up SMTP Credentials

Add the following environment variables to your `backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 2: Gmail Setup (Recommended)

If using Gmail, you need to:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
  - Go to Google Account Settings
  - Security → 2-Step Verification → App passwords
  - Generate a password for "Mail"
  - Use this password in `SMTP_PASS`

### Step 3: Alternative Email Providers

#### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## How It Works

### Registration Flow

1. User fills registration form (name, email, password, role)
2. User clicks "Send Verification Code"
3. System checks if email is already registered
4. Generates 6-digit OTP and stores it in database
5. Sends OTP via email
6. User enters OTP in verification component
7. System verifies OTP
8. Account is created with verified email

### Login Flow (OTP Method)

1. User selects "OTP" login method
2. User enters email address
3. User clicks "Send Verification Code"
4. System checks if email exists
5. Generates and sends OTP
6. User enters OTP
7. System verifies and logs user in

### Login Flow (Password Method)

- Traditional password-based login still works
- Users can toggle between Password and OTP methods

## API Endpoints

### Send OTP

```
POST /api/auth/send-otp
Body: { email: string, purpose: 'registration' | 'login' }
```

### Verify OTP

```
POST /api/auth/verify-otp
Body: { email: string, otp: string, purpose: 'registration' | 'login' }
```

### Register (with OTP)

```
POST /api/auth/register
Body: { 
  fullName, email, password, confirmPassword, 
  phone, role, agreeToTerms, otp 
}
```

### Login (with OTP)

```
POST /api/auth/login
Body: { 
  email, loginMethod: 'password' | 'otp', 
  password (if password), otp (if otp), role 
}
```

## Database Schema

### OTP Model

```javascript
{
  email: String (required, indexed),
  otp: String (required, 6 digits),
  purpose: 'registration' | 'login' | 'password_reset',
  expiresAt: Date (required, auto-expires),
  verified: Boolean (default: false),
  attempts: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing Without Email Service

For development/testing, you can:

1. **Check Console Logs**: OTPs are logged to console in development
2. **Use Test Email Service**: Services like Mailtrap or Ethereal Email
3. **Mock Email Service**: Temporarily modify `emailService.js` to log OTPs

## Troubleshooting

### OTP Not Received

- Check spam folder
- Verify SMTP credentials are correct
- Check email service logs
- Ensure email address is valid

### "Email service not configured" Error

- Verify all SMTP environment variables are set
- Check `.env` file is loaded correctly
- Restart backend server after adding env variables

### OTP Expired

- Request a new OTP (wait for cooldown period)
- OTPs expire after 10 minutes

### Too Many Attempts

- Wait for OTP to expire
- Request a new OTP
- Maximum 5 attempts per OTP

## Security Considerations

1. **Rate Limiting**: Implemented to prevent spam
2. **OTP Expiration**: 10-minute validity window
3. **Attempt Limits**: Maximum 5 verification attempts
4. **Auto-cleanup**: Expired OTPs are automatically deleted
5. **One-time Use**: OTPs are deleted after successful verification

## Next Steps

- Set up production email service (SendGrid, Mailgun, etc.)
- Add email templates customization
- Implement password reset via OTP
- Add SMS OTP option (Twilio)
- Add email verification badge in user profile

