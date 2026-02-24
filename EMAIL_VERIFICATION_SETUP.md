# Email Verification Setup Guide

This guide explains how to set up **real email verification** for WorkNest registration and login.

## Features Implemented

✅ **Email Verification for Registration**
- Users register → Account created but email not verified
- Verification email sent automatically with secure link
- User clicks link → Email verified → Can login
- Prevents fake email registrations

✅ **Email Verification Check on Login**
- Login checks if email is verified
- If not verified, shows warning and resends verification email
- Users cannot login until email is verified

✅ **Security Features**
- Secure verification tokens (32-byte random)
- Tokens expire in 24 hours
- One-time use tokens
- Automatic token cleanup

## Required Tools & Packages

### Backend Dependencies
- **nodemailer** - For sending emails
  ```bash
  cd backend
  npm install nodemailer
  ```

### Frontend Dependencies
- No additional packages required

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

# Client URL (for verification links)
CLIENT_URL=http://localhost:3000
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
2. User clicks "Create Account"
3. Account is created with `emailVerified: false`
4. System generates secure verification token
5. Verification email sent with link: `/verify-email?token=...`
6. User clicks link in email
7. System verifies token and sets `emailVerified: true`
8. User can now login

### Login Flow

1. User enters email and password
2. System checks if email is verified
3. **If verified**: Login successful
4. **If not verified**: 
   - Shows warning message
   - Option to resend verification email
   - Login blocked until verified

### Email Verification Flow

1. User clicks verification link from email
2. Frontend navigates to `/verify-email?token=...`
3. Backend validates token (checks expiry, not used)
4. Sets `emailVerified: true` in database
5. Shows success message
6. Redirects to login page

## API Endpoints

### Register
```
POST /api/auth/register
Body: { 
  fullName, email, password, confirmPassword, 
  phone, role, agreeToTerms 
}
Response: { 
  message: "Registration successful! Please check your email...",
  requiresVerification: true 
}
```

### Login
```
POST /api/auth/login
Body: { email, password, role }
Response (if not verified): {
  message: "Please verify your email...",
  requiresVerification: true,
  email: "user@example.com"
}
```

### Verify Email
```
GET /api/auth/verify-email?token=...
Response: {
  message: "Email verified successfully!",
  verified: true
}
```

### Resend Verification
```
POST /api/auth/resend-verification
Body: { email }
Response: {
  message: "Verification email sent..."
}
```

## Database Schema

### User Model (Updated)
```javascript
{
  email: String,
  emailVerified: Boolean (default: false),
  emailVerificationToken: String (nullable),
  emailVerificationExpires: Date (nullable),
  // ... other fields
}
```

### EmailVerification Model
```javascript
{
  email: String (indexed),
  token: String (unique, indexed),
  expiresAt: Date (auto-expires),
  verified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Routes

- `/register` - Registration page (shows success message after registration)
- `/login` - Login page (shows verification warning if not verified)
- `/verify-email` - Email verification page (handles token verification)

## Testing Without Email Service

For development/testing:

1. **Check Console Logs**: Verification tokens are logged to console
2. **Use Test Email Service**: Services like Mailtrap or Ethereal Email
3. **Manual Verification**: Copy token from logs and visit `/verify-email?token=...`

## Troubleshooting

### Verification Email Not Received
- Check spam folder
- Verify SMTP credentials are correct
- Check email service logs
- Ensure email address is valid
- Check `CLIENT_URL` is set correctly

### "Email service not configured" Warning
- Verify all SMTP environment variables are set
- Check `.env` file is loaded correctly
- Restart backend server after adding env variables
- Token will still be logged to console for testing

### Verification Link Expired
- Links expire after 24 hours
- Use "Resend Verification" option
- Request new verification email

### "Invalid or expired verification token"
- Token may have been used already (one-time use)
- Token may have expired (24 hours)
- Request new verification email

## Security Considerations

1. **Secure Tokens**: 32-byte random tokens (cryptographically secure)
2. **Token Expiration**: 24-hour validity window
3. **One-time Use**: Tokens are marked as verified after use
4. **Auto-cleanup**: Expired tokens are automatically deleted
5. **Email Validation**: Ensures only real emails can register

## User Experience

### Registration Success Message
After registration, users see:
- ✅ Success message
- 📧 Email address confirmation
- Instructions to check inbox
- Link to login page

### Login with Unverified Email
If user tries to login without verifying:
- ⚠️ Warning message displayed
- Option to resend verification email
- Clear instructions to verify email first

### Email Verification Page
- Shows loading state while verifying
- Success message when verified
- Error message if token invalid/expired
- Auto-redirects to login after 3 seconds

## Next Steps

- [ ] Set up production email service (SendGrid, Mailgun, etc.)
- [ ] Customize email templates
- [ ] Add email verification badge in user profile
- [ ] Implement password reset via email
- [ ] Add email change verification flow
