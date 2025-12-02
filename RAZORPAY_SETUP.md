# Razorpay Payment Integration Setup Guide

## Prerequisites
1. Razorpay account created and activated
2. API keys from Razorpay Dashboard

## Step 1: Get Your Razorpay API Keys

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate **Key ID** and **Key Secret**
4. Copy both keys (you'll need them for environment variables)

## Step 2: Install Razorpay SDK

### Backend Installation
```bash
cd backend
npm install razorpay
```

### Frontend Installation
No installation needed! Razorpay checkout script is loaded dynamically from CDN.

## Step 3: Configure Environment Variables

### Backend (.env file)
Add these variables to your `backend/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Important:** 
- For **Test Mode**: Use test keys from Razorpay Dashboard
- For **Production**: Use live keys from Razorpay Dashboard

## Step 4: Test Mode vs Live Mode

### Test Mode (Development)
- Use test API keys from Razorpay Dashboard
- Test cards: https://razorpay.com/docs/payments/test-cards/
- No real money is charged

### Live Mode (Production)
- Use live API keys from Razorpay Dashboard
- Real payments will be processed
- Ensure your account is activated for live mode

## Step 5: Test Payment Flow

1. Start your backend server
2. Start your frontend server
3. Create a booking
4. Use test card details:
   - **Card Number**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits (e.g., 123)
   - **Expiry**: Any future date (e.g., 12/25)
   - **Name**: Any name

## Payment Flow

1. User clicks "Book Now"
2. Booking is created with `paymentStatus: 'pending'`
3. Razorpay order is created
4. Razorpay checkout modal opens
5. User completes payment
6. Payment is verified on backend
7. Booking status updated to `confirmed` and `paymentStatus: 'paid'`

## Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Always verify payment signature on backend
- Store payment IDs in database for reference
- Handle payment failures gracefully

## Troubleshooting

### Payment not working?
1. Check if API keys are correct
2. Verify environment variables are loaded
3. Check browser console for errors
4. Verify Razorpay script is loading

### Payment verification fails?
1. Check if signature verification is working
2. Verify order ID matches
3. Check Razorpay dashboard for payment status

## Support

- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com

