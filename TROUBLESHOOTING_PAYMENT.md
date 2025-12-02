# Payment Error Troubleshooting Guide

## Error: POST /api/payments/create-order 500

This error indicates a server-side issue when creating a Razorpay payment order. Follow these steps to diagnose and fix:

### Step 1: Check Razorpay Configuration

**Most Common Issue: Missing API Keys**

1. Check if you have added Razorpay keys to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_key_secret_here
   ```

2. Verify keys are correct:
   - Go to https://dashboard.razorpay.com/
   - Settings → API Keys
   - Copy Key ID and Key Secret exactly (no extra spaces)

3. **Restart your backend server** after adding keys:
   ```bash
   cd backend
   npm run dev
   ```

### Step 2: Check Backend Console Logs

Look for these messages in your backend console:

**If you see:**
```
Razorpay keys not found in environment variables
```
→ Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env

**If you see:**
```
Failed to initialize Razorpay: [error message]
```
→ Check if your API keys are valid

**If you see:**
```
Create order error: [error details]
```
→ Check the error details for specific issues

### Step 3: Common Error Causes

#### 1. Missing Environment Variables
**Error Message:** "Payment gateway not configured"
**Solution:** Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env

#### 2. Invalid API Keys
**Error Message:** "Invalid Razorpay API keys"
**Solution:** 
- Verify keys in Razorpay Dashboard
- Ensure you're using test keys for development
- Check for typos or extra spaces

#### 3. Booking Amount Too Low
**Error Message:** "Invalid booking amount"
**Solution:** Minimum amount is ₹1 (100 paise)

#### 4. Network/API Issues
**Error Message:** Various Razorpay API errors
**Solution:**
- Check internet connection
- Verify Razorpay service status
- Check if keys are for correct environment (test vs live)

### Step 4: Test Payment Configuration

Create a test endpoint to verify configuration:

```javascript
// Add this temporarily to paymentRoutes.js for testing
router.get('/test-config', (req, res) => {
  res.json({
    hasKeyId: !!process.env.RAZORPAY_KEY_ID,
    hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    razorpayInitialized: !!razorpay,
    keyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8) || 'not set'
  });
});
```

Visit: `http://localhost:5000/api/payments/test-config`

### Step 5: Verify Booking Data

Check if the booking has valid data:
- `totalAmount` must be a number >= 1
- `bookingDate` must be a valid date
- `spaceName` should exist

### Step 6: Check Razorpay Dashboard

1. Log in to Razorpay Dashboard
2. Go to **Orders** section
3. Check if any orders are being created
4. Look for error messages in dashboard

### Quick Fix Checklist

- [ ] Added RAZORPAY_KEY_ID to backend/.env
- [ ] Added RAZORPAY_KEY_SECRET to backend/.env
- [ ] Restarted backend server after adding keys
- [ ] Verified keys are correct (no typos)
- [ ] Checked backend console for error messages
- [ ] Verified booking amount is >= ₹1
- [ ] Tested with valid booking ID

### Still Not Working?

1. **Check backend console** for detailed error messages
2. **Verify .env file** is in the `backend` folder (not root)
3. **Check if dotenv is loading** - add `console.log(process.env.RAZORPAY_KEY_ID)` temporarily
4. **Test Razorpay keys** directly:
   ```bash
   # In backend folder
   node -e "console.log('Key ID:', process.env.RAZORPAY_KEY_ID)"
   ```

### Need More Help?

Check the detailed error in backend console and look for:
- Status code (400, 401, 500)
- Error message
- Error description
- Stack trace

Share these details for further debugging.

