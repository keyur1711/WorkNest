# Test Cases Documentation

## Test Scenario: Register/Login of Business Owner or Manager

### Test Environment
- **Application URL:** https://voxtrust.netlify.app/

---

## Test Case Details

### Test Case ID: TC01
- **Test Scenario:** Register/Login of Business Owner or Manager
- **Step Details:** 
  - Navigate to https://voxtrust.netlify.app/
- **Expected Result:** 
  - Site should open
- **Actual Result:** 
  - Site Opened as expected
- **Status:** ✅ **Pass**

---

### Test Case ID: TC02A
- **Test Scenario:** Register/Login of Business Owner or Manager
- **Step Details:** 
  - Navigate to signup page
  - Enter name: mike
  - Enter Email: mike@gmail
  - Password: 12345678
- **Expected Result:** 
  - Error message should display: "Enter valid email ID"
- **Actual Result:** 
  - Error message displayed
- **Status:** ❌ **Fail**

**Note:** Test case failed - validation error message was displayed as expected, but the test status indicates a failure. This may indicate that the error message format or behavior did not match the exact expected result.

---

### Test Case ID: TC02B
- **Test Scenario:** Register/Login of Business Owner or Manager
- **Step Details:** 
  - Navigate to signup page
  - Enter name: mili
  - Enter Email: mili@gmail.com
  - Password: 1234
- **Expected Result:** 
  - Error message should display: "Password must be at least 8 characters"
- **Actual Result:** 
  - Error message displayed
- **Status:** ❌ **Fail**

**Note:** Test case failed - validation error message was displayed as expected, but the test status indicates a failure. This may indicate that the error message format or behavior did not match the exact expected result.

---

### Test Case ID: TC02C
- **Test Scenario:** Register/Login of Business Owner or Manager
- **Step Details:** 
  - Navigate to signup page
  - Enter name: john
  - Enter Email: john@gmail.com
  - Password: 12345678
- **Expected Result:** 
  - Verification email should receive
- **Actual Result:** 
  - Verification email received
- **Status:** ✅ **Pass**

---

### Test Case ID: TC03
- **Test Scenario:** Register/Login of Business Owner or Manager
- **Step Details:** 
  - Navigate to login page
  - Enter Email: john@gmail.com
  - Password: 123456789
- **Expected Result:** 
  - Application should Redirect to dashboard
- **Actual Result:** 
  - Redirected to dashboard
- **Status:** ✅ **Pass**

---

## Test Summary

| Test Case ID | Test Type | Status | Description |
|--------------|-----------|--------|-------------|
| TC01 | Navigation | ✅ Pass | Site accessibility test |
| TC02A | Validation | ❌ Fail | Email format validation |
| TC02B | Validation | ❌ Fail | Password length validation |
| TC02C | Registration | ✅ Pass | Successful user registration |
| TC03 | Authentication | ✅ Pass | Successful user login |

### Overall Test Results
- **Total Test Cases:** 5
- **Passed:** 3 (60%)
- **Failed:** 2 (40%)

### Test Data Used
- **Test User 1:** 
  - Name: mike
  - Email: mike@gmail (invalid format)
  - Password: 12345678

- **Test User 2:** 
  - Name: mili
  - Email: mili@gmail.com
  - Password: 1234 (invalid length)

- **Test User 3:** 
  - Name: john
  - Email: john@gmail.com
  - Password: 12345678 (registration)
  - Password: 123456789 (login)

---

## Observations

1. **TC02A and TC02B** show "Fail" status even though error messages were displayed as expected. This suggests:
   - The error message text might not match exactly
   - The error message might appear in a different location or format
   - There might be additional validation issues not captured in the test

2. **TC02C** successfully demonstrates the complete registration flow with email verification.

3. **TC03** confirms successful authentication and redirection to the dashboard after login.

---

## Recommendations

1. Review TC02A and TC02B to understand why they failed despite displaying error messages
2. Verify exact error message text matches expected results
3. Consider adding more test cases for:
   - Edge cases in email validation
   - Password complexity requirements
   - Account verification flow
   - Error handling scenarios
   - Session management

---

## Test Scenario: User Registration - Additional Cases

### Test Case ID: TC04
- **Test Scenario:** User Registration - Workspace Owner Registration
- **Step Details:** 
  - Navigate to signup page
  - Enter name: sarah
  - Enter Email: sarah@gmail.com
  - Password: 12345678
  - Select role: workspace_owner
  - Check agree to terms
  - Click Register
- **Expected Result:** 
  - Workspace owner account created successfully
  - Redirected to workspace owner dashboard
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC05
- **Test Scenario:** User Registration - Duplicate Email
- **Step Details:** 
  - Navigate to signup page
  - Enter name: john
  - Enter Email: john@gmail.com (already registered)
  - Password: 12345678
  - Select role: user
  - Check agree to terms
  - Click Register
- **Expected Result:** 
  - Error message: "Email already registered"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC06
- **Test Scenario:** User Registration - Missing Required Fields
- **Step Details:** 
  - Navigate to signup page
  - Leave name field empty
  - Enter Email: test@gmail.com
  - Password: 12345678
  - Click Register
- **Expected Result:** 
  - Error message: "Full name is required"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC07
- **Test Scenario:** User Registration - Terms Not Agreed
- **Step Details:** 
  - Navigate to signup page
  - Enter name: test
  - Enter Email: test@gmail.com
  - Password: 12345678
  - Select role: user
  - Do NOT check agree to terms
  - Click Register
- **Expected Result:** 
  - Error message: "You must agree to the terms and conditions"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: User Login - Additional Cases

### Test Case ID: TC08
- **Test Scenario:** User Login - Invalid Email
- **Step Details:** 
  - Navigate to login page
  - Enter Email: wrong@gmail.com
  - Password: 12345678
  - Select role: user
  - Click Login
- **Expected Result:** 
  - Error message: "Invalid email or password"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC09
- **Test Scenario:** User Login - Invalid Password
- **Step Details:** 
  - Navigate to login page
  - Enter Email: john@gmail.com
  - Password: wrongpassword
  - Select role: user
  - Click Login
- **Expected Result:** 
  - Error message: "Invalid email or password"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC10
- **Test Scenario:** User Login - Wrong Role Selection
- **Step Details:** 
  - Navigate to login page
  - Enter Email: john@gmail.com (registered as user)
  - Password: 12345678
  - Select role: workspace_owner
  - Click Login
- **Expected Result:** 
  - Error message indicating role mismatch
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC11
- **Test Scenario:** User Login - Workspace Owner Login
- **Step Details:** 
  - Navigate to login page
  - Enter Email: sarah@gmail.com
  - Password: 12345678
  - Select role: workspace_owner
  - Click Login
- **Expected Result:** 
  - Redirected to workspace owner dashboard
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Space Management

### Test Case ID: TC12
- **Test Scenario:** View All Spaces
- **Step Details:** 
  - Navigate to /search or home page
- **Expected Result:** 
  - List of all available spaces displayed
  - Spaces show name, city, type, price, rating
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC13
- **Test Scenario:** Filter Spaces by City
- **Step Details:** 
  - Navigate to /search
  - Select city from dropdown (e.g., "Mumbai")
  - Click Apply Filters
- **Expected Result:** 
  - Only spaces from selected city displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC14
- **Test Scenario:** Filter Spaces by Type
- **Step Details:** 
  - Navigate to /search
  - Select type from dropdown (e.g., "Hot Desk")
  - Click Apply Filters
- **Expected Result:** 
  - Only spaces of selected type displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC15
- **Test Scenario:** Filter Spaces by Price Range
- **Step Details:** 
  - Navigate to /search
  - Set min price: 500
  - Set max price: 2000
  - Click Apply Filters
- **Expected Result:** 
  - Only spaces within price range displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC16
- **Test Scenario:** Search Spaces by Keyword
- **Step Details:** 
  - Navigate to /search
  - Enter search term: "coffee"
  - Click Search
- **Expected Result:** 
  - Spaces matching keyword in name, city, or description displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC17
- **Test Scenario:** View Space Details
- **Step Details:** 
  - Navigate to /search
  - Click on a space card
  - Or navigate to /spaces/:id
- **Expected Result:** 
  - Space details page displayed with:
    - Images
    - Name, city, type
    - Price per day
    - Rating
    - Amenities
    - Description
    - Map location
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC18
- **Test Scenario:** Workspace Owner - Create Space
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Add New Space"
  - Fill form:
    - Name: "Tech Hub Mumbai"
    - City: "Mumbai"
    - Type: "Hot Desk"
    - Price Per Day: 1000
    - Capacity: 50
    - Coordinates: lat: 19.0760, lng: 72.8777
    - Amenities: Wi-Fi, Coffee, Parking
    - Description: "Modern co-working space"
    - Images: Upload 3 images
  - Click Create
- **Expected Result:** 
  - Space created successfully
  - Space appears in owner's listings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC19
- **Test Scenario:** Workspace Owner - Create Space with Missing Required Fields
- **Step Details:** 
  - Login as workspace owner
  - Navigate to create space form
  - Leave name field empty
  - Fill other fields
  - Click Create
- **Expected Result:** 
  - Error message: "Name is required"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC20
- **Test Scenario:** Workspace Owner - Update Space
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Edit" on a space
  - Update price per day to 1500
  - Update description
  - Click Save
- **Expected Result:** 
  - Space updated successfully
  - Changes reflected immediately
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC21
- **Test Scenario:** Workspace Owner - Delete Space
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Delete" on a space
  - Confirm deletion
- **Expected Result:** 
  - Space deleted successfully
  - Space removed from listings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Booking Management

### Test Case ID: TC22
- **Test Scenario:** Create Booking - Successful
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Book Now"
  - Select booking date (future date)
  - Select type: "Hot Desk"
  - Click Confirm Booking
- **Expected Result:** 
  - Booking created with status "pending"
  - Booking appears in user's bookings
  - Redirected to payment page
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC23
- **Test Scenario:** Create Booking - Past Date
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Book Now"
  - Select booking date (yesterday)
  - Select type: "Hot Desk"
  - Click Confirm Booking
- **Expected Result:** 
  - Error message: "Booking date cannot be in the past"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC24
- **Test Scenario:** Create Booking - Already Booked Date
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Book Now"
  - Select booking date that is already booked and paid
  - Select type: "Hot Desk"
  - Click Confirm Booking
- **Expected Result:** 
  - Error message: "This date is already booked. Please select another date."
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC25
- **Test Scenario:** View User Bookings
- **Step Details:** 
  - Login as user
  - Navigate to /bookings or /dashboard
- **Expected Result:** 
  - List of user's bookings displayed
  - Shows booking date, space name, status, amount
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC26
- **Test Scenario:** Cancel Booking
- **Step Details:** 
  - Login as user
  - Navigate to booking history
  - Click "Cancel" on a pending booking
  - Confirm cancellation
- **Expected Result:** 
  - Booking status changed to "cancelled"
  - Payment status changed to "refunded" if paid
  - Booking removed from active bookings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC27
- **Test Scenario:** Workspace Owner - View Bookings for Their Spaces
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Bookings" tab
- **Expected Result:** 
  - List of bookings for owner's spaces displayed
  - Shows user info, space name, booking date, status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC28
- **Test Scenario:** Workspace Owner - Mark Booking as Completed
- **Step Details:** 
  - Login as workspace owner
  - Navigate to bookings
  - Click "Mark as Completed" on a paid booking
  - Confirm action
- **Expected Result:** 
  - Booking status changed to "completed"
  - Booking moved to history
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Tour Booking Management

### Test Case ID: TC29
- **Test Scenario:** Request Tour - Successful
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Request Tour"
  - Fill form:
    - Tour Date: Future date
    - Tour Time: "10:00 AM"
    - Contact Name: "John Doe"
    - Contact Email: "john@gmail.com"
    - Contact Phone: "+1234567890"
    - Notes: "Interested in private office"
  - Click Submit
- **Expected Result:** 
  - Tour booking created with status "pending"
  - Tour appears in user's tour history
  - Owner notified
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC30
- **Test Scenario:** Request Tour - Past Date
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Request Tour"
  - Select tour date (yesterday)
  - Fill other required fields
  - Click Submit
- **Expected Result:** 
  - Error message: "Tour date cannot be in the past"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC31
- **Test Scenario:** View User Tour Bookings
- **Step Details:** 
  - Login as user
  - Navigate to /tour-history or /dashboard
- **Expected Result:** 
  - List of user's tour bookings displayed
  - Shows tour date, space name, status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC32
- **Test Scenario:** Cancel Tour Booking
- **Step Details:** 
  - Login as user
  - Navigate to tour history
  - Click "Cancel" on a pending tour
  - Confirm cancellation
- **Expected Result:** 
  - Tour status changed to "cancelled"
  - Tour removed from active tours
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC33
- **Test Scenario:** Workspace Owner - View Tour Requests
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Tour Requests" tab
- **Expected Result:** 
  - List of tour requests for owner's spaces displayed
  - Shows user info, space name, tour date, status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC34
- **Test Scenario:** Workspace Owner - Confirm Tour Request
- **Step Details:** 
  - Login as workspace owner
  - Navigate to tour requests
  - Click "Confirm" on a pending tour
- **Expected Result:** 
  - Tour status changed to "confirmed"
  - User notified
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Payment Management

### Test Case ID: TC35
- **Test Scenario:** Create Payment Order
- **Step Details:** 
  - Login as user
  - Create a booking
  - Navigate to payment page
  - Click "Pay Now"
- **Expected Result:** 
  - Razorpay order created
  - Order ID and key ID returned
  - Payment gateway opened
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC36
- **Test Scenario:** Create Payment Order - Already Paid Booking
- **Step Details:** 
  - Login as user
  - Try to create payment order for already paid booking
- **Expected Result:** 
  - Error message: "Booking is already paid"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC37
- **Test Scenario:** Verify Payment - Successful
- **Step Details:** 
  - Complete payment through Razorpay gateway
  - Payment callback received
- **Expected Result:** 
  - Payment verified successfully
  - Booking status changed to "confirmed"
  - Payment status changed to "paid"
  - Payment record created
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC38
- **Test Scenario:** Check Payment Status
- **Step Details:** 
  - Login as user
  - Navigate to booking details
  - Check payment status
- **Expected Result:** 
  - Payment status displayed (pending/paid/refunded)
  - Booking status displayed
  - Payment details if available
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Review Management

### Test Case ID: TC39
- **Test Scenario:** Submit Review - Successful
- **Step Details:** 
  - Login as user
  - Navigate to completed booking
  - Click "Write Review"
  - Enter rating: 5
  - Enter comment: "Great space, highly recommended!"
  - Click Submit
- **Expected Result:** 
  - Review created and published
  - Space rating updated
  - Review appears on space details page
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC40
- **Test Scenario:** Submit Review - Invalid Rating
- **Step Details:** 
  - Login as user
  - Try to submit review with rating 0 or 6
- **Expected Result:** 
  - Error message: "Rating must be between 1 and 5"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC41
- **Test Scenario:** Submit Review - Unpaid Booking
- **Step Details:** 
  - Login as user
  - Try to review unpaid booking
- **Expected Result:** 
  - Error message: "You can only review paid bookings"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC42
- **Test Scenario:** Submit Review - Already Reviewed
- **Step Details:** 
  - Login as user
  - Try to submit second review for same booking
- **Expected Result:** 
  - Error message: "You have already reviewed this booking"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC43
- **Test Scenario:** View Space Reviews
- **Step Details:** 
  - Navigate to space details page
  - Scroll to reviews section
- **Expected Result:** 
  - List of published reviews for the space displayed
  - Shows rating and comments
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Favorites Management

### Test Case ID: TC44
- **Test Scenario:** Add Space to Favorites
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Add to Favorites" button
- **Expected Result:** 
  - Space added to favorites
  - Button changes to "Remove from Favorites"
  - Space appears in favorites list
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC45
- **Test Scenario:** Remove Space from Favorites
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Remove from Favorites" button
- **Expected Result:** 
  - Space removed from favorites
  - Button changes to "Add to Favorites"
  - Space removed from favorites list
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC46
- **Test Scenario:** View User Favorites
- **Step Details:** 
  - Login as user
  - Navigate to /favorites
- **Expected Result:** 
  - List of favorited spaces displayed
  - Shows space details, images, price
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Contact Form

### Test Case ID: TC47
- **Test Scenario:** Submit Contact Form - Successful
- **Step Details:** 
  - Navigate to /contact
  - Fill form:
    - Full Name: "John Doe"
    - Email: "john@gmail.com"
    - Subject: "Inquiry about pricing"
    - Message: "I would like to know more about your pricing plans"
    - Company: "ABC Corp" (optional)
    - Phone: "+1234567890" (optional)
  - Click Submit
- **Expected Result:** 
  - Form submitted successfully
  - Success message displayed
  - Form data logged/emailed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC48
- **Test Scenario:** Submit Contact Form - Missing Required Fields
- **Step Details:** 
  - Navigate to /contact
  - Leave name field empty
  - Fill other fields
  - Click Submit
- **Expected Result:** 
  - Error message: "Full name is required"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC49
- **Test Scenario:** Submit Contact Form - Invalid Email
- **Step Details:** 
  - Navigate to /contact
  - Enter invalid email: "invalid-email"
  - Fill other required fields
  - Click Submit
- **Expected Result:** 
  - Error message: "Valid email is required"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: User Dashboard

### Test Case ID: TC50
- **Test Scenario:** User - View Dashboard
- **Step Details:** 
  - Login as user
  - Navigate to /dashboard
- **Expected Result:** 
  - Dashboard displayed with:
    - Welcome message
    - Total bookings count
    - Saved spaces count
    - Tour requests count
    - Upcoming bookings (next 3)
    - Upcoming tours (next 2)
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC51
- **Test Scenario:** User - View Booking History
- **Step Details:** 
  - Login as user
  - Navigate to /bookings or /dashboard
  - Click "View All Bookings"
- **Expected Result:** 
  - Complete booking history displayed
  - Shows past and upcoming bookings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC52
- **Test Scenario:** Workspace Owner - View Dashboard
- **Step Details:** 
  - Login as workspace owner
  - Navigate to /workspace-owner
- **Expected Result:** 
  - Workspace owner dashboard displayed with:
    - Overview statistics
    - Spaces management
    - Bookings management
    - Tour requests
    - Earnings reports
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: User Profile Management

### Test Case ID: TC53
- **Test Scenario:** Get Current User Profile
- **Step Details:** 
  - Login as user
  - Navigate to profile page
- **Expected Result:** 
  - User profile data displayed (without password)
  - Shows name, email, phone, role
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC54
- **Test Scenario:** Update User Profile
- **Step Details:** 
  - Login as user
  - Navigate to profile page
  - Update full name to "John Doe"
  - Update phone to "+1234567890"
  - Click Save
- **Expected Result:** 
  - Profile updated successfully
  - Changes reflected immediately
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC55
- **Test Scenario:** Update User Email
- **Step Details:** 
  - Login as user
  - Navigate to profile page
  - Update email to "newemail@gmail.com"
  - Click Save
- **Expected Result:** 
  - Email updated successfully
  - New email reflected in profile
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Scenario: Access Control

### Test Case ID: TC56
- **Test Scenario:** Access Protected Route Without Authentication
- **Step Details:** 
  - Without logging in, navigate to /dashboard
- **Expected Result:** 
  - Redirected to login page
  - Error message displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC57
- **Test Scenario:** Regular User - Cannot Create Space
- **Step Details:** 
  - Login as regular user
  - Try to access space creation endpoint
  - Or try to navigate to create space page
- **Expected Result:** 
  - Access denied
  - Error message or redirect
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TC58
- **Test Scenario:** Regular User - Cannot Access Other User's Booking
- **Step Details:** 
  - Login as user A
  - Try to access booking of user B via API
  - Or try to view booking details of another user
- **Expected Result:** 
  - Access denied
  - Error message: "Access denied"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Updated Test Summary

| Test Case ID | Test Type | Status | Description |
|--------------|-----------|--------|-------------|
| TC01 | Navigation | ✅ Pass | Site accessibility test |
| TC02A | Validation | ❌ Fail | Email format validation |
| TC02B | Validation | ❌ Fail | Password length validation |
| TC02C | Registration | ✅ Pass | Successful user registration |
| TC03 | Authentication | ✅ Pass | Successful user login |
| TC04-TC58 | Various | [Pending] | Additional test cases for all modules |

### Overall Test Results
- **Total Test Cases:** 58
- **Passed:** 3 (from original tests)
- **Failed:** 2 (from original tests)
- **Pending:** 53 (new test cases to be executed)

### Test Coverage
- ✅ Authentication & Registration (TC01-TC11)
- ✅ Space Management (TC12-TC21)
- ✅ Booking Management (TC22-TC28)
- ✅ Tour Booking Management (TC29-TC34)
- ✅ Payment Management (TC35-TC38)
- ✅ Review Management (TC39-TC43)
- ✅ Favorites Management (TC44-TC46)
- ✅ Contact Form (TC47-TC49)
- ✅ User Dashboard (TC50-TC52)
- ✅ Profile Management (TC53-TC55)
- ✅ Access Control (TC56-TC58)

---

## Additional Recommendations

1. Execute all pending test cases (TC04-TC58)
2. Document actual results for each test case
3. Update status column based on test execution
4. Create bug reports for failed test cases
5. Add performance test cases for load testing
6. Add security test cases for vulnerability testing
7. Add integration test cases for end-to-end workflows
8. Consider automated testing for regression testing