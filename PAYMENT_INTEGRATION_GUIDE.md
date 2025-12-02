# Razorpay Payment Integration - Complete Guide

## 🎯 Overview

This guide will help you integrate Razorpay payment gateway into your WorkNest booking system. Users will now be required to pay before their booking is confirmed.

## 📋 Prerequisites

1. ✅ Razorpay account created (you mentioned you already have one)
2. ✅ Razorpay account activated
3. ✅ API keys generated from Razorpay Dashboard

## 🔧 Setup Steps

### Step 1: Get Your Razorpay API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Click **Generate Key** if you haven't already
4. Copy your **Key ID** and **Key Secret**
   - ⚠️ **Important**: Keep Key Secret secure and never expose it in frontend code

### Step 2: Configure Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx  # Your Key ID
RAZORPAY_KEY_SECRET=your_key_secret_here  # Your Key Secret
```

**For Production:**
- Replace test keys with live keys from Razorpay Dashboard
- Ensure your account is activated for live transactions

### Step 3: Install Razorpay SDK (Already Done ✅)

The Razorpay SDK has been installed in the backend. No frontend installation needed as we load Razorpay from CDN.

### Step 4: Restart Your Servers

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## 💳 How Payment Flow Works

### User Journey:

1. **User selects space and date** → Clicks "Book Now"
2. **Booking created** → Booking saved with `paymentStatus: 'pending'`
3. **Payment order created** → Razorpay order generated on backend
4. **Razorpay checkout opens** → User sees payment modal
5. **User completes payment** → Enters card details
6. **Payment verified** → Backend verifies payment signature
7. **Booking confirmed** → Status updated to `confirmed` and `paymentStatus: 'paid'`
8. **Redirect** → User redirected to bookings page

### Technical Flow:

```
Frontend (Details.jsx)
  ↓
1. createBooking() → Creates booking with status 'pending'
  ↓
2. createPaymentOrder(bookingId) → Creates Razorpay order
  ↓
3. Razorpay Checkout Modal Opens
  ↓
4. User Pays → Razorpay processes payment
  ↓
5. handler() callback → Receives payment response
  ↓
6. verifyPayment() → Verifies payment on backend
  ↓
7. Backend verifies signature → Updates booking
  ↓
8. Success → Booking confirmed, redirect to /bookings
```

## 🧪 Testing Payment Integration

### Test Mode (Development)

Use Razorpay test keys and test cards:

**Test Card Details:**
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

**Other Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- More: https://razorpay.com/docs/payments/test-cards/

### Live Mode (Production)

1. Switch to live API keys in `.env`
2. Real payments will be processed
3. Ensure account is activated for live mode

## 📁 Files Modified/Created

### Backend:
- ✅ `backend/src/models/Booking.js` - Added Razorpay fields
- ✅ `backend/src/routes/paymentRoutes.js` - Payment routes (NEW)
- ✅ `backend/src/app.js` - Added payment routes
- ✅ `backend/package.json` - Added razorpay dependency

### Frontend:
- ✅ `frontend/src/services/paymentService.js` - Payment service (NEW)
- ✅ `frontend/src/pages/Details.jsx` - Updated booking flow

## 🔐 Security Features

1. **Payment Signature Verification**: All payments are verified using HMAC SHA256
2. **Server-side Verification**: Payment verification happens on backend only
3. **Secure Key Storage**: Key Secret never exposed to frontend
4. **Order ID Tracking**: Each booking has unique Razorpay order ID

## 📊 Database Changes

The `Booking` model now includes:
- `razorpayOrderId` - Razorpay order ID
- `razorpayPaymentId` - Razorpay payment ID
- `razorpaySignature` - Payment signature for verification
- `paymentStatus` - Now includes 'failed' status

## 🐛 Troubleshooting

### Issue: Payment modal not opening
**Solution:**
- Check browser console for errors
- Verify Razorpay script is loading
- Check if API keys are correct

### Issue: Payment verification fails
**Solution:**
- Verify Key Secret is correct in `.env`
- Check if order ID matches
- Verify payment status in Razorpay Dashboard

### Issue: "Invalid payment signature"
**Solution:**
- Ensure Key Secret in backend matches Razorpay Dashboard
- Check if payment was actually successful
- Verify order ID and payment ID are correct

### Issue: Booking not updating after payment
**Solution:**
- Check backend logs for errors
- Verify payment verification endpoint is working
- Check database for booking updates

## 📝 API Endpoints

### POST `/api/payments/create-order`
Creates a Razorpay order for a booking.

**Request:**
```json
{
  "bookingId": "booking_id_here"
}
```

**Response:**
```json
{
  "orderId": "order_xxxxx",
  "amount": 89900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx"
}
```

### POST `/api/payments/verify-payment`
Verifies payment and updates booking.

**Request:**
```json
{
  "bookingId": "booking_id",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and booking confirmed",
  "booking": { ... }
}
```

### GET `/api/payments/status/:bookingId`
Get payment status for a booking.

**Response:**
```json
{
  "paymentStatus": "paid",
  "bookingStatus": "confirmed",
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx"
}
```

## ✅ Checklist

- [ ] Razorpay account created and activated
- [ ] API keys generated from Razorpay Dashboard
- [ ] Environment variables added to `backend/.env`
- [ ] Razorpay SDK installed (`npm install razorpay` in backend)
- [ ] Backend server restarted
- [ ] Frontend server restarted
- [ ] Test payment with test card
- [ ] Verify booking status updates after payment
- [ ] Check Razorpay Dashboard for payment records

## 🚀 Going Live

1. **Activate Live Mode** in Razorpay Dashboard
2. **Generate Live API Keys**
3. **Update `.env`** with live keys
4. **Test with small amount** first
5. **Monitor transactions** in Razorpay Dashboard

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Razorpay Support**: support@razorpay.com
- **Test Cards**: https://razorpay.com/docs/payments/test-cards/

## 🎉 You're All Set!

Your payment integration is complete! Users can now pay securely when booking workspaces.

