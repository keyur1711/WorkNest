# WorkNest - Complete Test Cases Documentation

## Project Overview
**Application Name:** WorkNest  
**Application URL:** https://voxtrust.netlify.app/ (or your deployed URL)  
**Description:** Co-working space booking platform connecting users, workspace owners, and administrators

---

## Table of Contents
1. [Authentication Module](#1-authentication-module)
2. [Space Management Module](#2-space-management-module)
3. [Booking Module](#3-booking-module)
4. [Tour Booking Module](#4-tour-booking-module)
5. [Payment Module](#5-payment-module)
6. [Review Module](#6-review-module)
7. [Favorites Module](#7-favorites-module)
8. [Contact Module](#8-contact-module)
9. [Admin Module](#9-admin-module)
10. [Workspace Owner Module](#10-workspace-owner-module)
11. [User Dashboard Module](#11-user-dashboard-module)

---

## 1. Authentication Module

### Test Case ID: AUTH-001
- **Test Scenario:** Site Navigation
- **Step Details:** 
  - Navigate to https://voxtrust.netlify.app/
- **Expected Result:** 
  - Site should open and display home page
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-002
- **Test Scenario:** User Registration - Invalid Email Format
- **Step Details:** 
  - Navigate to signup page
  - Enter name: mike
  - Enter Email: mike@gmail (invalid format)
  - Password: 12345678
  - Select role: user
  - Check agree to terms
  - Click Register
- **Expected Result:** 
  - Error message should display: "Enter valid email ID" or "Valid email is required"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-003
- **Test Scenario:** User Registration - Password Too Short
- **Step Details:** 
  - Navigate to signup page
  - Enter name: mili
  - Enter Email: mili@gmail.com
  - Password: 1234 (less than 6 characters)
  - Select role: user
  - Check agree to terms
  - Click Register
- **Expected Result:** 
  - Error message should display: "Password must be at least 6 characters"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-004
- **Test Scenario:** User Registration - Successful Registration
- **Step Details:** 
  - Navigate to signup page
  - Enter name: john
  - Enter Email: john@gmail.com
  - Password: 12345678
  - Select role: user
  - Check agree to terms
  - Click Register
- **Expected Result:** 
  - User account created successfully
  - JWT token received
  - Redirected to dashboard
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-005
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

### Test Case ID: AUTH-006
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

### Test Case ID: AUTH-007
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

### Test Case ID: AUTH-008
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

### Test Case ID: AUTH-009
- **Test Scenario:** User Login - Successful Login
- **Step Details:** 
  - Navigate to login page
  - Enter Email: john@gmail.com
  - Password: 12345678
  - Select role: user
  - Click Login
- **Expected Result:** 
  - Application should redirect to dashboard
  - JWT token stored
  - User session active
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-010
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

### Test Case ID: AUTH-011
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

### Test Case ID: AUTH-012
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

### Test Case ID: AUTH-013
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

### Test Case ID: AUTH-014
- **Test Scenario:** Get Current User Profile
- **Step Details:** 
  - Login as user
  - Navigate to profile page
  - Or call GET /api/auth/me
- **Expected Result:** 
  - User profile data displayed (without password)
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-015
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

### Test Case ID: AUTH-016
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

### Test Case ID: AUTH-017
- **Test Scenario:** Update Profile - Duplicate Email
- **Step Details:** 
  - Login as user
  - Navigate to profile page
  - Update email to existing user's email
  - Click Save
- **Expected Result:** 
  - Error message: "Email already in use"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: AUTH-018
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

## 2. Space Management Module

### Test Case ID: SPACE-001
- **Test Scenario:** View All Spaces
- **Step Details:** 
  - Navigate to /search or home page
  - Or call GET /api/spaces
- **Expected Result:** 
  - List of all available spaces displayed
  - Pagination working if spaces > limit
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: SPACE-002
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

### Test Case ID: SPACE-003
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

### Test Case ID: SPACE-004
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

### Test Case ID: SPACE-005
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

### Test Case ID: SPACE-006
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

### Test Case ID: SPACE-007
- **Test Scenario:** View Space Reviews
- **Step Details:** 
  - Navigate to space details page
  - Scroll to reviews section
  - Or call GET /api/spaces/:id/reviews
- **Expected Result:** 
  - List of published reviews for the space displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: SPACE-008
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

### Test Case ID: SPACE-009
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

### Test Case ID: SPACE-010
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

### Test Case ID: SPACE-011
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

### Test Case ID: SPACE-012
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

### Test Case ID: SPACE-013
- **Test Scenario:** Get Space Filters (Cities and Types)
- **Step Details:** 
  - Navigate to /search
  - Or call GET /api/spaces/filters
- **Expected Result:** 
  - List of available cities and space types returned
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: SPACE-014
- **Test Scenario:** View Non-Existent Space
- **Step Details:** 
  - Navigate to /spaces/invalid-id
- **Expected Result:** 
  - Error message: "Space not found" or 404 page
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 3. Booking Module

### Test Case ID: BOOK-001
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

### Test Case ID: BOOK-002
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

### Test Case ID: BOOK-003
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

### Test Case ID: BOOK-004
- **Test Scenario:** View User Bookings
- **Step Details:** 
  - Login as user
  - Navigate to /bookings or /dashboard
  - Or call GET /api/bookings/my-bookings
- **Expected Result:** 
  - List of user's bookings displayed
  - Shows booking date, space name, status, amount
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-005
- **Test Scenario:** View Single Booking Details
- **Step Details:** 
  - Login as user
  - Navigate to booking history
  - Click on a booking
  - Or call GET /api/bookings/:id
- **Expected Result:** 
  - Booking details displayed with:
    - Space information
    - Booking date
    - Status
    - Payment status
    - Amount
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-006
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

### Test Case ID: BOOK-007
- **Test Scenario:** Cancel Already Cancelled Booking
- **Step Details:** 
  - Login as user
  - Try to cancel a booking that is already cancelled
- **Expected Result:** 
  - Error message: "Booking already cancelled"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-008
- **Test Scenario:** View Booking Agreement
- **Step Details:** 
  - Login as user
  - Navigate to booking details
  - Click "View Agreement"
  - Or call GET /api/bookings/:id/agreement
- **Expected Result:** 
  - Agreement document/content displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-009
- **Test Scenario:** Accept Booking Agreement
- **Step Details:** 
  - Login as user
  - Navigate to booking details
  - View agreement
  - Click "Accept Agreement"
  - Or call POST /api/bookings/:id/agreement/accept
- **Expected Result:** 
  - Agreement accepted
  - Agreement acceptance timestamp recorded
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-010
- **Test Scenario:** Workspace Owner - View Bookings for Their Spaces
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Bookings" tab
  - Or call GET /api/owner/bookings
- **Expected Result:** 
  - List of bookings for owner's spaces displayed
  - Shows user info, space name, booking date, status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-011
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

### Test Case ID: BOOK-012
- **Test Scenario:** Workspace Owner - Cannot Complete Unpaid Booking
- **Step Details:** 
  - Login as workspace owner
  - Try to mark unpaid booking as completed
- **Expected Result:** 
  - Error message: "Cannot complete unpaid booking"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: BOOK-013
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

## 4. Tour Booking Module

### Test Case ID: TOUR-001
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

### Test Case ID: TOUR-002
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

### Test Case ID: TOUR-003
- **Test Scenario:** Request Tour - Invalid Email Format
- **Step Details:** 
  - Login as user
  - Navigate to tour request form
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

### Test Case ID: TOUR-004
- **Test Scenario:** View User Tour Bookings
- **Step Details:** 
  - Login as user
  - Navigate to /tour-history or /dashboard
  - Or call GET /api/bookings/tour/my-tours
- **Expected Result:** 
  - List of user's tour bookings displayed
  - Shows tour date, space name, status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TOUR-005
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

### Test Case ID: TOUR-006
- **Test Scenario:** Cancel Completed Tour
- **Step Details:** 
  - Login as user
  - Try to cancel a tour that is already completed
- **Expected Result:** 
  - Error message: "Cannot cancel a completed tour"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TOUR-007
- **Test Scenario:** Workspace Owner - View Tour Requests
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Tour Requests" tab
  - Or call GET /api/owner/tour-requests
- **Expected Result:** 
  - List of tour requests for owner's spaces displayed
  - Shows user info, space name, tour date, status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TOUR-008
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

### Test Case ID: TOUR-009
- **Test Scenario:** Workspace Owner - Cancel Tour Request
- **Step Details:** 
  - Login as workspace owner
  - Navigate to tour requests
  - Click "Cancel" on a pending tour
- **Expected Result:** 
  - Tour status changed to "cancelled"
  - User notified
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TOUR-010
- **Test Scenario:** Workspace Owner - Mark Tour as Completed
- **Step Details:** 
  - Login as workspace owner
  - Navigate to tour requests
  - Click "Mark as Completed" on a confirmed tour
- **Expected Result:** 
  - Tour status changed to "completed"
  - Tour moved to history
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: TOUR-011
- **Test Scenario:** Regular User - Cannot Access Other User's Tours
- **Step Details:** 
  - Login as user A
  - Try to access tour booking of user B
- **Expected Result:** 
  - Access denied
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 5. Payment Module

### Test Case ID: PAY-001
- **Test Scenario:** Create Payment Order
- **Step Details:** 
  - Login as user
  - Create a booking
  - Navigate to payment page
  - Click "Pay Now"
  - Or call POST /api/payment/create-order with bookingId
- **Expected Result:** 
  - Razorpay order created
  - Order ID and key ID returned
  - Payment gateway opened
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: PAY-002
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

### Test Case ID: PAY-003
- **Test Scenario:** Create Payment Order - Cancelled Booking
- **Step Details:** 
  - Login as user
  - Try to create payment order for cancelled booking
- **Expected Result:** 
  - Error message: "Cannot pay for a cancelled booking"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: PAY-004
- **Test Scenario:** Verify Payment - Successful
- **Step Details:** 
  - Complete payment through Razorpay gateway
  - Payment callback received
  - Or call POST /api/payment/verify-payment with:
    - bookingId
    - razorpay_order_id
    - razorpay_payment_id
    - razorpay_signature
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

### Test Case ID: PAY-005
- **Test Scenario:** Verify Payment - Invalid Signature
- **Step Details:** 
  - Call POST /api/payment/verify-payment with invalid signature
- **Expected Result:** 
  - Error message: "Invalid payment signature"
  - Payment status remains "pending"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: PAY-006
- **Test Scenario:** Check Payment Status
- **Step Details:** 
  - Login as user
  - Navigate to booking details
  - Check payment status
  - Or call GET /api/payment/status/:bookingId
- **Expected Result:** 
  - Payment status displayed (pending/paid/refunded)
  - Booking status displayed
  - Payment details if available
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: PAY-007
- **Test Scenario:** Payment Reconciliation
- **Step Details:** 
  - Login as user or admin
  - Call POST /api/payment/reconcile with bookingId and paymentId
- **Expected Result:** 
  - Payment reconciled successfully
  - Booking status updated to "confirmed"
  - Payment status updated to "paid"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: PAY-008
- **Test Scenario:** Check Razorpay Configuration
- **Step Details:** 
  - Call GET /api/payment/check-config
- **Expected Result:** 
  - Configuration status returned
  - Shows if Razorpay is properly configured
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: PAY-009
- **Test Scenario:** Payment Gateway Not Configured
- **Step Details:** 
  - Remove Razorpay keys from environment
  - Try to create payment order
- **Expected Result:** 
  - Error message: "Payment gateway not configured"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 6. Review Module

### Test Case ID: REV-001
- **Test Scenario:** Submit Review - Successful
- **Step Details:** 
  - Login as user
  - Navigate to completed booking
  - Click "Write Review"
  - Enter rating: 5
  - Enter comment: "Great space, highly recommended!"
  - Click Submit
  - Or call POST /api/reviews with bookingId, rating, comment
- **Expected Result:** 
  - Review created and published
  - Space rating updated
  - Review appears on space details page
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: REV-002
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

### Test Case ID: REV-003
- **Test Scenario:** Submit Review - Comment Too Long
- **Step Details:** 
  - Login as user
  - Try to submit review with comment > 500 characters
- **Expected Result:** 
  - Error message: "Comment must be less than 500 characters"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: REV-004
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

### Test Case ID: REV-005
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

### Test Case ID: REV-006
- **Test Scenario:** Submit Review - Other User's Booking
- **Step Details:** 
  - Login as user A
  - Try to review booking of user B
- **Expected Result:** 
  - Error message: "Access denied"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: REV-007
- **Test Scenario:** View Review for Booking
- **Step Details:** 
  - Login as user
  - Navigate to booking details
  - View review section
  - Or call GET /api/reviews/booking/:bookingId
- **Expected Result:** 
  - Review displayed if exists
  - Shows rating and comment
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: REV-008
- **Test Scenario:** Workspace Owner - View Reviews for Their Spaces
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Reviews" tab
  - Or call GET /api/owner/reviews
- **Expected Result:** 
  - List of reviews for owner's spaces displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: REV-009
- **Test Scenario:** Workspace Owner - Update Review Status
- **Step Details:** 
  - Login as workspace owner
  - Navigate to reviews
  - Change review status to "hidden"
- **Expected Result:** 
  - Review status updated
  - Review hidden from public view
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: REV-010
- **Test Scenario:** Space Rating Calculation
- **Step Details:** 
  - Multiple users submit reviews with different ratings
  - Check space rating
- **Expected Result:** 
  - Space rating is average of all published reviews
  - Rating count updated
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 7. Favorites Module

### Test Case ID: FAV-001
- **Test Scenario:** Add Space to Favorites
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Add to Favorites" button
  - Or call POST /api/favorites/:spaceId
- **Expected Result:** 
  - Space added to favorites
  - Button changes to "Remove from Favorites"
  - Space appears in favorites list
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: FAV-002
- **Test Scenario:** Add Non-Existent Space to Favorites
- **Step Details:** 
  - Login as user
  - Try to add invalid space ID to favorites
- **Expected Result:** 
  - Error message: "Space not found"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: FAV-003
- **Test Scenario:** Add Already Favorited Space
- **Step Details:** 
  - Login as user
  - Try to add space that is already in favorites
- **Expected Result:** 
  - Message: "Already in favorites"
  - No duplicate added
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: FAV-004
- **Test Scenario:** Remove Space from Favorites
- **Step Details:** 
  - Login as user
  - Navigate to space details page
  - Click "Remove from Favorites" button
  - Or call DELETE /api/favorites/:spaceId
- **Expected Result:** 
  - Space removed from favorites
  - Button changes to "Add to Favorites"
  - Space removed from favorites list
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: FAV-005
- **Test Scenario:** View User Favorites
- **Step Details:** 
  - Login as user
  - Navigate to /favorites
  - Or call GET /api/favorites
- **Expected Result:** 
  - List of favorited spaces displayed
  - Shows space details, images, price
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: FAV-006
- **Test Scenario:** View Favorites Without Login
- **Step Details:** 
  - Without logging in, navigate to /favorites
- **Expected Result:** 
  - Redirected to login page
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 8. Contact Module

### Test Case ID: CONT-001
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
  - Or call POST /api/contact
- **Expected Result:** 
  - Form submitted successfully
  - Success message displayed
  - Form data logged/emailed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: CONT-002
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

### Test Case ID: CONT-003
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

### Test Case ID: CONT-004
- **Test Scenario:** Submit Contact Form - Empty Message
- **Step Details:** 
  - Navigate to /contact
  - Leave message field empty
  - Fill other required fields
  - Click Submit
- **Expected Result:** 
  - Error message: "Message is required"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 9. Admin Module

### Test Case ID: ADMIN-001
- **Test Scenario:** Admin - View Statistics
- **Step Details:** 
  - Login as admin
  - Navigate to admin dashboard
  - Or call GET /api/admin/stats
- **Expected Result:** 
  - Statistics displayed:
    - Total users
    - Total spaces
    - Total bookings
    - Total tour bookings
    - Active bookings
    - Pending bookings
    - Workspace owners count
    - Total revenue
    - Recent bookings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-002
- **Test Scenario:** Admin - View All Users
- **Step Details:** 
  - Login as admin
  - Navigate to admin dashboard
  - Click "Users" tab
  - Or call GET /api/admin/users
- **Expected Result:** 
  - List of all users displayed with pagination
  - Shows user details (without password)
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-003
- **Test Scenario:** Admin - Filter Users by Role
- **Step Details:** 
  - Login as admin
  - Navigate to users page
  - Filter by role: "workspace_owner"
  - Or call GET /api/admin/users?role=workspace_owner
- **Expected Result:** 
  - Only workspace owners displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-004
- **Test Scenario:** Admin - View Single User
- **Step Details:** 
  - Login as admin
  - Navigate to user details
  - Or call GET /api/admin/users/:id
- **Expected Result:** 
  - User details displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-005
- **Test Scenario:** Admin - Update User
- **Step Details:** 
  - Login as admin
  - Navigate to user details
  - Update user role to "workspace_owner"
  - Click Save
  - Or call PATCH /api/admin/users/:id
- **Expected Result:** 
  - User updated successfully
  - Role changed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-006
- **Test Scenario:** Admin - Delete User
- **Step Details:** 
  - Login as admin
  - Navigate to user details
  - Click "Delete User"
  - Confirm deletion
  - Or call DELETE /api/admin/users/:id
- **Expected Result:** 
  - User deleted successfully
  - User removed from system
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-007
- **Test Scenario:** Admin - Cannot Delete Own Account
- **Step Details:** 
  - Login as admin
  - Try to delete own account
- **Expected Result:** 
  - Error message: "Cannot delete your own account"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-008
- **Test Scenario:** Admin - View All Spaces
- **Step Details:** 
  - Login as admin
  - Navigate to admin dashboard
  - Click "Spaces" tab
  - Or call GET /api/admin/spaces
- **Expected Result:** 
  - List of all spaces displayed with pagination
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-009
- **Test Scenario:** Admin - Create Space
- **Step Details:** 
  - Login as admin
  - Navigate to spaces
  - Click "Create Space"
  - Fill form and submit
  - Or call POST /api/admin/spaces
- **Expected Result:** 
  - Space created successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-010
- **Test Scenario:** Admin - Update Space
- **Step Details:** 
  - Login as admin
  - Navigate to space details
  - Update space details
  - Click Save
  - Or call PATCH /api/admin/spaces/:id
- **Expected Result:** 
  - Space updated successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-011
- **Test Scenario:** Admin - Delete Space
- **Step Details:** 
  - Login as admin
  - Navigate to space details
  - Click "Delete Space"
  - Confirm deletion
  - Or call DELETE /api/admin/spaces/:id
- **Expected Result:** 
  - Space deleted successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-012
- **Test Scenario:** Admin - View All Bookings
- **Step Details:** 
  - Login as admin
  - Navigate to admin dashboard
  - Click "Bookings" tab
  - Or call GET /api/admin/bookings
- **Expected Result:** 
  - List of all bookings displayed with pagination
  - Shows user, space, date, status, payment status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-013
- **Test Scenario:** Admin - Filter Bookings by Status
- **Step Details:** 
  - Login as admin
  - Navigate to bookings
  - Filter by status: "pending"
  - Or call GET /api/admin/bookings?status=pending
- **Expected Result:** 
  - Only pending bookings displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-014
- **Test Scenario:** Admin - Update Booking Status
- **Step Details:** 
  - Login as admin
  - Navigate to booking details
  - Change status to "confirmed"
  - Click Save
  - Or call PATCH /api/admin/bookings/:id/status
- **Expected Result:** 
  - Booking status updated
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-015
- **Test Scenario:** Admin - View All Tour Bookings
- **Step Details:** 
  - Login as admin
  - Navigate to admin dashboard
  - Click "Tour Bookings" tab
  - Or call GET /api/admin/tour-bookings
- **Expected Result:** 
  - List of all tour bookings displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-016
- **Test Scenario:** Admin - Update Tour Booking Status
- **Step Details:** 
  - Login as admin
  - Navigate to tour booking details
  - Change status to "confirmed"
  - Or call PATCH /api/admin/tour-bookings/:id/status
- **Expected Result:** 
  - Tour booking status updated
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: ADMIN-017
- **Test Scenario:** Regular User - Cannot Access Admin Routes
- **Step Details:** 
  - Login as regular user
  - Try to access /api/admin/stats
- **Expected Result:** 
  - Access denied
  - Error message or 403 status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 10. Workspace Owner Module

### Test Case ID: OWNER-001
- **Test Scenario:** Workspace Owner - View Dashboard Overview
- **Step Details:** 
  - Login as workspace owner
  - Navigate to /workspace-owner
  - Or call GET /api/owner/dashboard/overview
- **Expected Result:** 
  - Dashboard displayed with:
    - Total spaces
    - Total bookings
    - Active bookings
    - Tour requests
    - Total revenue
    - Earnings by month
    - Top spaces
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-002
- **Test Scenario:** Workspace Owner - View Their Spaces
- **Step Details:** 
  - Login as workspace owner
  - Navigate to workspace owner dashboard
  - Click "Listings" tab
  - Or call GET /api/owner/spaces
- **Expected Result:** 
  - List of owner's spaces displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-003
- **Test Scenario:** Workspace Owner - Create Space
- **Step Details:** 
  - Login as workspace owner
  - Navigate to create space form
  - Fill all required fields
  - Click Create
  - Or call POST /api/owner/spaces
- **Expected Result:** 
  - Space created with ownerUser set to current user
  - Space appears in owner's listings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-004
- **Test Scenario:** Workspace Owner - Update Their Space
- **Step Details:** 
  - Login as workspace owner
  - Navigate to edit space form
  - Update space details
  - Click Save
  - Or call PATCH /api/owner/spaces/:id
- **Expected Result:** 
  - Space updated successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-005
- **Test Scenario:** Workspace Owner - Cannot Update Other Owner's Space
- **Step Details:** 
  - Login as workspace owner A
  - Try to update space owned by owner B
- **Expected Result:** 
  - Access denied
  - Error message: "You are not allowed to manage this space"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-006
- **Test Scenario:** Workspace Owner - Delete Their Space
- **Step Details:** 
  - Login as workspace owner
  - Navigate to space details
  - Click "Delete"
  - Confirm deletion
  - Or call DELETE /api/owner/spaces/:id
- **Expected Result:** 
  - Space deleted successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-007
- **Test Scenario:** Workspace Owner - View Bookings for Their Spaces
- **Step Details:** 
  - Login as workspace owner
  - Navigate to "Bookings" tab
  - Or call GET /api/owner/bookings
- **Expected Result:** 
  - List of bookings for owner's spaces displayed
  - Shows active and history bookings
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-008
- **Test Scenario:** Workspace Owner - View Active Bookings
- **Step Details:** 
  - Login as workspace owner
  - Navigate to bookings
  - Filter by scope: "active"
  - Or call GET /api/owner/bookings?scope=active
- **Expected Result:** 
  - Only pending and confirmed bookings displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-009
- **Test Scenario:** Workspace Owner - View Booking History
- **Step Details:** 
  - Login as workspace owner
  - Navigate to bookings
  - Filter by scope: "history"
  - Or call GET /api/owner/bookings?scope=history
- **Expected Result:** 
  - Only completed and cancelled bookings displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-010
- **Test Scenario:** Workspace Owner - Mark Booking as Completed
- **Step Details:** 
  - Login as workspace owner
  - Navigate to bookings
  - Click "Mark as Completed" on paid booking
  - Or call PATCH /api/owner/bookings/:id/complete
- **Expected Result:** 
  - Booking status changed to "completed"
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-011
- **Test Scenario:** Workspace Owner - View Tour Requests
- **Step Details:** 
  - Login as workspace owner
  - Navigate to "Tours" tab
  - Or call GET /api/owner/tour-requests
- **Expected Result:** 
  - List of tour requests for owner's spaces displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-012
- **Test Scenario:** Workspace Owner - Update Tour Status
- **Step Details:** 
  - Login as workspace owner
  - Navigate to tour requests
  - Change tour status to "confirmed"
  - Or call PATCH /api/owner/tour-requests/:id/status
- **Expected Result:** 
  - Tour status updated
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-013
- **Test Scenario:** Workspace Owner - View Agreements
- **Step Details:** 
  - Login as workspace owner
  - Navigate to "Agreements" tab
  - Or call GET /api/owner/agreements
- **Expected Result:** 
  - List of agreements for owner's spaces displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-014
- **Test Scenario:** Workspace Owner - Create Agreement
- **Step Details:** 
  - Login as workspace owner
  - Navigate to create agreement form
  - Fill form:
    - Space: Select space
    - Title: "Rental Agreement"
    - Document URL: "https://example.com/agreement.pdf"
  - Click Create
  - Or call POST /api/owner/agreements
- **Expected Result:** 
  - Agreement created successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-015
- **Test Scenario:** Workspace Owner - Update Agreement
- **Step Details:** 
  - Login as workspace owner
  - Navigate to agreement details
  - Update agreement status
  - Or call PATCH /api/owner/agreements/:id
- **Expected Result:** 
  - Agreement updated successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-016
- **Test Scenario:** Workspace Owner - View Reviews
- **Step Details:** 
  - Login as workspace owner
  - Navigate to "Reviews" tab
  - Or call GET /api/owner/reviews
- **Expected Result:** 
  - List of reviews for owner's spaces displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-017
- **Test Scenario:** Workspace Owner - Update Review Status
- **Step Details:** 
  - Login as workspace owner
  - Navigate to reviews
  - Change review status to "hidden"
  - Or call PATCH /api/owner/reviews/:id
- **Expected Result:** 
  - Review status updated
  - Review hidden from public view
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-018
- **Test Scenario:** Workspace Owner - View Earnings Report
- **Step Details:** 
  - Login as workspace owner
  - Navigate to reports
  - View earnings
  - Or call GET /api/owner/reports/earnings
- **Expected Result:** 
  - Earnings report displayed
  - Shows revenue by space
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-019
- **Test Scenario:** Workspace Owner - Submit Support Ticket
- **Step Details:** 
  - Login as workspace owner
  - Navigate to support
  - Fill form:
    - Subject: "Payment issue"
    - Message: "Need help with payment processing"
    - Priority: "high"
  - Click Submit
  - Or call POST /api/owner/support
- **Expected Result:** 
  - Support ticket created successfully
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: OWNER-020
- **Test Scenario:** Regular User - Cannot Access Owner Routes
- **Step Details:** 
  - Login as regular user
  - Try to access /api/owner/dashboard/overview
- **Expected Result:** 
  - Access denied
  - Error message or 403 status
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## 11. User Dashboard Module

### Test Case ID: DASH-001
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

### Test Case ID: DASH-002
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

### Test Case ID: DASH-003
- **Test Scenario:** User - View Tour History
- **Step Details:** 
  - Login as user
  - Navigate to /tour-history or /dashboard
  - Click "View All Tours"
- **Expected Result:** 
  - Complete tour history displayed
  - Shows past and upcoming tours
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: DASH-004
- **Test Scenario:** User - View Favorites from Dashboard
- **Step Details:** 
  - Login as user
  - Navigate to /dashboard
  - Click "View Favorites" or navigate to /favorites
- **Expected Result:** 
  - Favorites list displayed
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

### Test Case ID: DASH-005
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

### Test Case ID: DASH-006
- **Test Scenario:** Admin - View Dashboard
- **Step Details:** 
  - Login as admin
  - Navigate to /admin
- **Expected Result:** 
  - Admin dashboard displayed with:
    - Platform statistics
    - User management
    - Space management
    - Booking management
    - Tour booking management
- **Actual Result:** 
  - [To be filled during testing]
- **Status:** 
  - [Pending/Pass/Fail]

---

## Test Summary

### Total Test Cases by Module:
- **Authentication Module:** 18 test cases
- **Space Management Module:** 14 test cases
- **Booking Module:** 13 test cases
- **Tour Booking Module:** 11 test cases
- **Payment Module:** 9 test cases
- **Review Module:** 10 test cases
- **Favorites Module:** 6 test cases
- **Contact Module:** 4 test cases
- **Admin Module:** 17 test cases
- **Workspace Owner Module:** 20 test cases
- **User Dashboard Module:** 6 test cases

**Total Test Cases: 128**

---

## Test Execution Guidelines

1. **Test Environment Setup:**
   - Ensure backend server is running
   - Ensure frontend is running
   - Database is connected and seeded with test data
   - Razorpay keys configured (for payment tests)

2. **Test Data Preparation:**
   - Create test users (regular user, workspace owner, admin)
   - Create test spaces
   - Create test bookings and tours

3. **Test Execution:**
   - Execute test cases in order
   - Fill in "Actual Result" column during testing
   - Mark status as Pass/Fail based on results
   - Document any bugs or issues found

4. **Test Reporting:**
   - Calculate pass/fail percentage
   - Document critical bugs
   - Create bug reports for failed test cases

---

## Notes

- All test cases should be executed in a controlled test environment
- Use test data that can be easily reset
- Document any deviations from expected results
- Update test cases as features evolve
- Consider adding performance and security test cases

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Prepared By:** [Tester Name]

