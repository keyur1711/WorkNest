# WorkNest - Pseudo Code for All Implemented Modules

## Table of Contents
1. [Authentication Module](#1-authentication-module)
2. [User Management Module](#2-user-management-module)
3. [Space Management Module](#3-space-management-module)
4. [Booking Module](#4-booking-module)
5. [Tour Booking Module](#5-tour-booking-module)
6. [Payment Module](#6-payment-module)
7. [Review Module](#7-review-module)
8. [Favorites Module](#8-favorites-module)
9. [User Dashboard Module](#9-user-dashboard-module)
10. [Contact Module](#10-contact-module)
11. [Admin Module](#11-admin-module)
12. [Workspace Owner Module](#12-workspace-owner-module)

---

## 1. Authentication Module

### 1.1 User Registration
```
FUNCTION RegisterUser(formData):
    INPUT: fullName, email, password, confirmPassword, phone, role, agreeToTerms
    
    // Frontend Validation
    IF password !== confirmPassword THEN
        RETURN error: "Passwords do not match"
    END IF
    
    IF agreeToTerms !== true THEN
        RETURN error: "Must agree to terms"
    END IF
    
    IF role NOT IN ['user', 'workspace_owner'] THEN
        role = 'user'  // Default to user
    END IF
    
    // Backend Processing
    POST /api/auth/register
    {
        fullName, email, password, phone, role, agreeToTerms
    }
    
    // Check if email exists
    existingUser = FIND User WHERE email = email
    IF existingUser EXISTS THEN
        RETURN error: "Email already registered"
    END IF
    
    // Hash password
    hashedPassword = bcrypt.hash(password, 12)
    
    // Create user
    newUser = CREATE User {
        fullName: fullName,
        email: email,
        password: hashedPassword,
        phone: phone,
        role: role,
        agreeToTerms: true,
        favorites: []
    }
    
    // Generate JWT token
    token = jwt.sign({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
    }, JWT_SECRET, { expiresIn: '7d' })
    
    // Save to localStorage
    localStorage.setItem('wn:auth', {
        user: newUser.toJSON(),
        token: token
    })
    
    // Redirect based on role
    IF newUser.role === 'workspace_owner' THEN
        REDIRECT to /workspace-owner
    ELSE
        REDIRECT to /dashboard
    END IF
END FUNCTION
```

### 1.2 User Login
```
FUNCTION LoginUser(credentials):
    INPUT: email, password, role (optional)
    
    // Send to Backend
    POST /api/auth/login
    {
        email, password, role
    }
    
    // Backend Processing
    user = FIND User WHERE email = email
    IF user NOT FOUND THEN
        RETURN error: "Invalid email or password"
    END IF
    
    // Verify password
    passwordMatch = bcrypt.compare(password, user.password)
    IF passwordMatch === false THEN
        RETURN error: "Invalid email or password"
    END IF
    
    // Role validation (for non-admin users)
    IF role IS PROVIDED AND user.role !== 'admin' THEN
        IF user.role !== role THEN
            RETURN error: "Invalid role selection"
        END IF
    END IF
    
    // Generate JWT token
    token = jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role
    }, JWT_SECRET, { expiresIn: '7d' })
    
    // Save to localStorage
    localStorage.setItem('wn:auth', {
        user: user.toJSON(),
        token: token
    })
    
    // Redirect based on role
    IF user.role === 'admin' THEN
        REDIRECT to /admin
    ELSE IF user.role === 'workspace_owner' THEN
        REDIRECT to /workspace-owner
    ELSE
        REDIRECT to /dashboard
    END IF
END FUNCTION
```

### 1.3 User Logout
```
FUNCTION LogoutUser():
    CLEAR localStorage.removeItem('wn:auth')
    REDIRECT to /login
END FUNCTION
```

### 1.4 Get Current User
```
FUNCTION GetCurrentUser():
    token = GET token FROM localStorage
    
    IF token NOT FOUND THEN
        RETURN null
    END IF
    
    // Backend Processing
    GET /api/auth/me
    HEADER: Authorization: Bearer <token>
    
    // Verify token
    decoded = jwt.verify(token, JWT_SECRET)
    user = FIND User WHERE _id = decoded.id
    
    IF user NOT FOUND THEN
        CLEAR localStorage
        RETURN null
    END IF
    
    RETURN user.toJSON()
END FUNCTION
```

### 1.5 Update User Profile
```
FUNCTION UpdateProfile(profileData):
    INPUT: fullName, email, phone

    user = FIND User WHERE _id = currentUser._id

    user.fullName = fullName
    user.email = email
    user.phone = phone
    
    SAVE user
    
    RETURN updated user
END FUNCTION
```

---

## 2. User Management Module

### 2.1 Authentication Middleware
```
FUNCTION AuthenticateRequest(request):
    token = EXTRACT token FROM Authorization header
    
    IF token NOT FOUND THEN
        RETURN error: "Authorization token missing"
    END IF
    
    // Verify token
    decoded = jwt.verify(token, JWT_SECRET)
    user = FIND User WHERE _id = decoded.id
    
    IF user NOT FOUND THEN
        RETURN error: "User not found"
    END IF
    
    // Attach user to request
    request.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    }
    
    RETURN next()
END FUNCTION
```

### 2.2 Role-Based Access Control
```
FUNCTION CheckAdminRole(request):
    IF request.user.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
    RETURN next()
END FUNCTION

FUNCTION CheckWorkspaceOwnerRole(request):
    IF request.user.role NOT IN ['workspace_owner', 'admin'] THEN
        RETURN error: "Workspace owner or admin access required"
    END IF
    RETURN next()
END FUNCTION
```

---

## 3. Space Management Module

### 3.1 Get All Spaces (with filters)
```
FUNCTION GetSpaces(filters):
    INPUT: city, type, minPrice, maxPrice, search, page, limit, sort
    
    IF city IS PROVIDED THEN
        query.city = city
    END IF
    
    IF type IS PROVIDED THEN
        query.type = type
    END IF
    
    IF minPrice IS PROVIDED OR maxPrice IS PROVIDED THEN
        query.pricePerDay = {}
        IF minPrice IS PROVIDED THEN
            query.pricePerDay.$gte = minPrice
        END IF
        IF maxPrice IS PROVIDED THEN
            query.pricePerDay.$lte = maxPrice
        END IF
    END IF
    
    IF search IS PROVIDED THEN
        query.$text = { $search: search }
    END IF
END FUNCTION
```

### 3.2 Get Space by ID
```
FUNCTION GetSpaceById(spaceId):
    INPUT: spaceId
    
    // Backend Processing
    GET /api/spaces/:id
    
    space = FIND Space WHERE _id = spaceId
    
    IF space NOT FOUND THEN
        RETURN error: "Space not found"
    END IF
    
    RETURN space
END FUNCTION
```

### 3.3 Create Space
```
FUNCTION CreateSpace(spaceData):
    INPUT: name, city, locationText, type, pricePerDay, capacity,
           coordinates (lat, lng), amenities, images, description,
           availability (openDays, openHours)
    
    IF name IS EMPTY OR city IS EMPTY OR type IS EMPTY THEN
        RETURN error: "Required fields missing"
    END IF
    RETURN newSpace
END FUNCTION
```

### 3.4 Update Space
```
FUNCTION UpdateSpace(spaceId, updateData):
    INPUT: spaceId, updateData (name, pricePerDay, rating, etc.)
    
    space = FIND Space WHERE _id = spaceId
    
    FOR EACH field IN updateData:
        space[field] = updateData[field]
    END FOR
    SAVE space
    RETURN updated space
END FUNCTION
```

### 3.5 Delete Space
```
FUNCTION DeleteSpace(spaceId):
    INPUT: spaceId
    
    space = FIND Space WHERE _id = spaceId
    
    IF space NOT FOUND THEN
        RETURN error: "Space not found"
    END IF
    
    DELETE space
    
    RETURN success message
END FUNCTION
```

### 3.6 Get Space Filters
```
FUNCTION GetSpaceFilters():
    
    cities = DISTINCT Space.city
    
    types = DISTINCT Space.type
    
    RETURN {
        cities: cities,
        types: types
    }
END FUNCTION
```

---

## 4. Booking Module

### 4.1 Create Booking
```
FUNCTION CreateBooking(bookingData):
    INPUT: spaceId, type, bookingDate
    
    IF bookingDate < TODAY THEN
        RETURN error: "Booking date cannot be in the past"
    END IF
    
    space = FIND Space WHERE _id = spaceId
    IF space NOT FOUND THEN
        RETURN error: "Space not found"
    END IF
    RETURN newBooking
END FUNCTION
```

### 4.2 Get User Bookings
```
FUNCTION GetUserBookings():
    
    bookings = FIND Booking WHERE user = currentUser._id
        SORT BY bookingDate DESC
        POPULATE space details
    RETURN bookings
END FUNCTION
```

### 4.3 Get Booking by ID
```
FUNCTION GetBookingById(bookingId):
    INPUT: bookingId
    
    // Backend Processing
    GET /api/bookings/:id
    HEADER: Authorization: Bearer <token>
    
    booking = FIND Booking WHERE _id = bookingId
        POPULATE space details
        POPULATE user details
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    // Check access
    IF booking.user !== currentUser._id AND currentUser.role !== 'admin' THEN
        RETURN error: "Access denied"
    END IF
    
    RETURN booking
END FUNCTION
```

### 4.4 Cancel Booking
```
FUNCTION CancelBooking(bookingId):
    INPUT: bookingId
    
    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    IF booking.user !== currentUser._id THEN
        RETURN error: "Access denied"
    END IF
    
    IF booking.status === 'cancelled' THEN
        RETURN error: "Booking already cancelled"
    END IF
    
    booking.status = 'cancelled'
    SAVE booking
    
    RETURN updated booking
END FUNCTION
```

---

## 5. Tour Booking Module

### 5.1 Create Tour Booking
```
FUNCTION CreateTourBooking(tourData):
    INPUT: spaceId, tourDate, tourTime, contactName, contactEmail,
           contactPhone, notes

    IF tourDate < TODAY THEN
        RETURN error: "Tour date cannot be in the past"
    END IF

    space = FIND Space WHERE _id = spaceId
    IF space NOT FOUND THEN
        RETURN error: "Space not found"
    END IF

    RETURN newTourBooking
END FUNCTION
```

### 5.2 Get User Tour Bookings
```
FUNCTION GetUserTourBookings():
    
    tourBookings = FIND TourBooking WHERE user = currentUser._id
        SORT BY tourDate DESC
        POPULATE space details
    
    RETURN tourBookings
END FUNCTION
```

### 5.3 Update Tour Booking Status (Admin/Owner)
```
FUNCTION UpdateTourBookingStatus(tourBookingId, newStatus):
    INPUT: tourBookingId, newStatus
    
    tourBooking = FIND TourBooking WHERE _id = tourBookingId
    
    IF tourBooking NOT FOUND THEN
        RETURN error: "Tour booking not found"
    END IF
    
    IF newStatus NOT IN ['pending', 'confirmed', 'cancelled', 'completed'] THEN
        RETURN error: "Invalid status"
    END IF
    
    tourBooking.status = newStatus
    SAVE tourBooking
    
    RETURN updated tourBooking
END FUNCTION
```

---

## 6. Payment Module

### 6.1 Create Payment Order
```
FUNCTION CreatePaymentOrder(bookingId):
    INPUT: bookingId

    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    IF booking.paymentStatus === 'paid' THEN
        RETURN error: "Booking is already paid"
    END IF
    
    IF booking.status === 'cancelled' THEN
        RETURN error: "Cannot pay for cancelled booking"
    END IF
    
    IF booking.totalAmount < 1 THEN
        RETURN error: "Invalid booking amount"
    END IF
    
    space = FIND Space WHERE _id = booking.space
    
    amountInPaise = booking.totalAmount * 100
    
    booking.razorpayOrderId = razorpayOrder.id
    SAVE booking
END FUNCTION
```

### 6.2 Verify Payment
```
FUNCTION VerifyPayment(paymentData):
    INPUT: bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature

    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    text = razorpay_order_id + "|" + razorpay_payment_id
    generatedSignature = HMAC_SHA256(text, RAZORPAY_KEY_SECRET)
    
    IF generatedSignature !== razorpay_signature THEN
        UPDATE Payment SET status = 'failed', failureReason = 'Invalid signature'
        RETURN error: "Invalid payment signature"
    END IF

    paymentInfo = FETCH Razorpay Payment WHERE id = razorpay_payment_id
    
    IF paymentInfo.status NOT IN ['captured', 'authorized'] THEN
        UPDATE Payment SET status = 'failed', failureReason = paymentInfo.status
        RETURN error: "Payment not successful"
    END IF
END FUNCTION
```

### 6.3 Get Payment Status
```
FUNCTION GetPaymentStatus(bookingId):
    INPUT: bookingId
    
    // Backend Processing
    GET /api/payments/status/:bookingId
    HEADER: Authorization: Bearer <token>
    
    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    payment = FIND Payment WHERE booking = bookingId
    
    // Auto-reconcile if pending and order exists
    IF booking.paymentStatus !== 'paid' AND booking.razorpayOrderId IS NOT NULL THEN
        orderPayments = FETCH Razorpay Order Payments WHERE order_id = booking.razorpayOrderId
        
        successfulPayment = FIND payment IN orderPayments WHERE status IN ['captured', 'authorized']
        
        IF successfulPayment EXISTS THEN
            booking.paymentStatus = 'paid'
            booking.status = 'confirmed'
            booking.razorpayPaymentId = successfulPayment.id
            booking.paidAt = CURRENT_TIMESTAMP
            SAVE booking
            
            UPDATE Payment SET {
                status: 'paid',
                razorpayPaymentId: successfulPayment.id
            } WHERE booking = bookingId
        END IF
    END IF
    
    RETURN {
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.status,
        razorpayOrderId: booking.razorpayOrderId,
        razorpayPaymentId: booking.razorpayPaymentId,
        payment: payment
    }
END FUNCTION
```

---

## 7. Review Module

### 7.1 Create Review
```
FUNCTION CreateReview(reviewData):
    INPUT: bookingId, rating, comment
    
    IF currentUser.role !== 'user' THEN
        RETURN error: "Only users can create reviews"
    END IF
    
    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    IF booking.user !== currentUser._id THEN
        RETURN error: "Access denied"
    END IF
    
    IF booking.paymentStatus !== 'paid' AND booking.status !== 'completed' THEN
        RETURN error: "You can only review paid bookings"
    END IF
    
    space = FIND Space WHERE _id = booking.space
    
    IF space NOT FOUND THEN
        RETURN error: "Space not found"
    END IF
    RETURN newReview
END FUNCTION
```

### 7.2 Get Review by Booking
```
FUNCTION GetReviewByBooking(bookingId):
    INPUT: bookingId
    
    // Backend Processing
    GET /api/reviews/booking/:bookingId
    HEADER: Authorization: Bearer <token>
    
    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    // Check access
    IF booking.user !== currentUser._id AND currentUser.role !== 'admin' THEN
        RETURN error: "Access denied"
    END IF
    
    // If no review exists
    IF booking.userReviewId IS NULL THEN
        RETURN {
            review: null,
            userRating: booking.userRating,
            userReviewComment: booking.userReviewComment
        }
    END IF
    
    // Get review
    review = FIND Review WHERE _id = booking.userReviewId
        POPULATE user details
    
    RETURN { review: review }
END FUNCTION
```

### 7.3 Update Space Rating
```
FUNCTION UpdateSpaceRating(spaceId):
    INPUT: spaceId
    
    // Aggregate reviews
    stats = AGGREGATE Review WHERE {
        space: spaceId,
        status: 'published'
    } GROUP BY space {
        avgRating: AVERAGE(rating),
        count: COUNT()
    }
    
    avgRating = IF stats.length > 0 THEN ROUND(stats[0].avgRating, 1) ELSE 0
    ratingCount = IF stats.length > 0 THEN stats[0].count ELSE 0
    
    // Update space
    UPDATE Space SET {
        rating: avgRating,
        ratingCount: ratingCount
    } WHERE _id = spaceId
END FUNCTION
```

---

## 8. Favorites Module

### 8.1 Get User Favorites
```
FUNCTION GetUserFavorites():
    
    user = FIND User WHERE _id = currentUser._id
        POPULATE favorites array with Space details
    
    RETURN user.favorites
END FUNCTION
```

### 8.2 Add to Favorites
```
FUNCTION AddToFavorites(spaceId):
    INPUT: spaceId
    
    space = FIND Space WHERE _id = spaceId
    
    IF space NOT FOUND THEN
        RETURN error: "Space not found"
    END IF
    
    user = FIND User WHERE _id = currentUser._id
    
    user.favorites.ADD(spaceId)
    SAVE user
    
    user = FIND User WHERE _id = currentUser._id
        POPULATE favorites array with Space details
    
    RETURN user.favorites
END FUNCTION
```

### 8.3 Remove from Favorites
```
FUNCTION RemoveFromFavorites(spaceId):
    INPUT: spaceId

    user = FIND User WHERE _id = currentUser._id
    
    user.favorites.REMOVE(spaceId)
    SAVE user
    
    user = FIND User WHERE _id = currentUser._id
        POPULATE favorites array with Space details
    
    RETURN user.favorites
END FUNCTION
```

---

## 9. User Dashboard Module

### 9.1 Load Dashboard Data
```
FUNCTION LoadDashboardData():
    
    IF user NOT FOUND THEN
        RETURN (no data loaded)
    END IF
    
    PARALLEL API CALLS:
        CALL GetUserBookings() → bookingsData
        CALL GetUserTourBookings() → toursData
        CALL GetUserFavorites() → favoritesData
    END PARALLEL
    
    IF bookingsData ERROR THEN
        bookings = []
    ELSE
        bookings = bookingsData.bookings
    END IF
    
    IF toursData ERROR THEN
        tourBookings = []
    ELSE
        tourBookings = toursData.tourBookings
    END IF
    
    IF favoritesData ERROR THEN
        favorites = []
    ELSE
        favorites = favoritesData.favorites
    END IF
END FUNCTION
```

### 9.2 Calculate Dashboard Statistics
```
FUNCTION CalculateDashboardStats(bookings, tourBookings, favorites):
    INPUT: bookings array, tourBookings array, favorites array
    
    // Calculate statistics
    totalBookings = LENGTH(bookings)
    totalSavedSpaces = LENGTH(favorites)
    totalTourRequests = LENGTH(tourBookings)
    
    // Filter upcoming bookings (not cancelled, date >= today)
    upcomingBookings = FILTER bookings WHERE {
        status !== 'cancelled' AND
        bookingDate >= CURRENT_DATE
    }
    SORT BY bookingDate ASC
    LIMIT TO first 3
    
    // Filter upcoming tours (not cancelled, date >= today)
    upcomingTours = FILTER tourBookings WHERE {
        status !== 'cancelled' AND
        tourDate >= CURRENT_DATE
    }
    SORT BY tourDate ASC
    LIMIT TO first 2
    
    RETURN {
        totalBookings: totalBookings,
        totalSavedSpaces: totalSavedSpaces,
        totalTourRequests: totalTourRequests,
        upcomingBookings: upcomingBookings,
        upcomingTours: upcomingTours
    }
END FUNCTION
```

### 9.3 Display Dashboard
```
FUNCTION DisplayDashboard():
    // Load dashboard data
    dashboardData = CALL LoadDashboardData()
    
    // Calculate statistics
    stats = CALL CalculateDashboardStats(
        dashboardData.bookings,
        dashboardData.tourBookings,
        dashboardData.favorites
    )
    
    // Display welcome message
    DISPLAY: "Welcome back, {user.fullName}!"
    
    // Display statistics cards
    DISPLAY STATISTICS GRID:
        CARD 1: Total Bookings
            - Count: stats.totalBookings
            - Link: /bookings
        
        CARD 2: Saved Spaces
            - Count: stats.totalSavedSpaces
            - Link: /favorites
        
        CARD 3: Tour Requests
            - Count: stats.totalTourRequests
            - Link: /tours
    END DISPLAY
    
    // Display upcoming bookings section
    DISPLAY SECTION: "Upcoming Bookings"
        IF stats.upcomingBookings.length === 0 THEN
            DISPLAY: "No upcoming bookings"
            DISPLAY BUTTON: "Book a Space" → /search
        ELSE
            FOR EACH booking IN stats.upcomingBookings:
                DISPLAY booking card WITH:
                    - Space name
                    - Booking date
                    - Booking type
                    - Total amount
                    - Status badge
            END FOR
            DISPLAY LINK: "View all" → /bookings
        END IF
    END DISPLAY
    
    // Display upcoming tours section
    DISPLAY SECTION: "Upcoming Tours"
        IF stats.upcomingTours.length === 0 THEN
            DISPLAY: "No scheduled tours"
        ELSE
            FOR EACH tour IN stats.upcomingTours:
                DISPLAY tour card WITH:
                    - Space name
                    - Tour date and time
                    - Space location
                    - Status badge
            END FOR
            DISPLAY LINK: "View all" → /tours
        END IF
    END DISPLAY
    
    // Display quick action links
    DISPLAY QUICK ACTIONS:
        LINK: "Explore Workspaces" → /search
        LINK: "Edit Profile" → /profile
    END DISPLAY
END FUNCTION
```

### 9.4 Refresh Dashboard Data
```
FUNCTION RefreshDashboard():
    // Set loading state
    SET loading = true
    SET error = null
    
    TRY
        // Reload all data
        dashboardData = CALL LoadDashboardData()
        
        // Update state
        SET bookings = dashboardData.bookings
        SET tourBookings = dashboardData.tourBookings
        SET favorites = dashboardData.favorites
        
        SET loading = false
    CATCH error
        SET error = "Failed to load dashboard data"
        SET loading = false
    END TRY
END FUNCTION
```

---

## 10. Contact Module

### 9.1 Submit Contact Form
```
FUNCTION SubmitContactForm(formData):
    INPUT: fullName, email, message, subject, company, phone
    
    // Backend Processing
    POST /api/contact
    BODY: { fullName, email, message, subject, company, phone }
    
    // Validate required fields
    IF fullName IS EMPTY OR email IS EMPTY OR message IS EMPTY THEN
        RETURN error: "Required fields missing"
    END IF
    
    // Validate email format
    IF email IS NOT VALID EMAIL THEN
        RETURN error: "Invalid email format"
    END IF
    
    // Log contact submission
    LOG Contact Form Submission {
        fullName: fullName,
        email: email,
        subject: subject OR 'General inquiry',
        company: company,
        phone: phone,
        message: message,
        timestamp: CURRENT_TIMESTAMP
    }
    
    // TODO: Save to database or send email notification
    // Example: CREATE ContactSubmission { fullName, email, message, ... }
    
    RETURN {
        message: "Thank you for contacting us! We will get back to you soon.",
        submitted: true
    }
END FUNCTION
```

---

## 11. Admin Module

### 10.1 Get Platform Statistics
```
FUNCTION GetPlatformStats():
    
    IF currentUser.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
    
    totalUsers = COUNT User
    totalSpaces = COUNT Space
    totalBookings = COUNT Booking
    totalTourBookings = COUNT TourBooking
    activeBookings = COUNT Booking WHERE status = 'confirmed'
    pendingBookings = COUNT Booking WHERE status = 'pending'
    workspaceOwners = COUNT User WHERE role = 'workspace_owner'
    
    paidBookings = FIND Booking WHERE paymentStatus = 'paid'
    totalRevenue = SUM paidBookings.totalAmount
END FUNCTION
```

### 10.2 Get All Users
```
FUNCTION GetAllUsers(filters):
    INPUT: page, limit, role
    
    IF currentUser.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
END FUNCTION
```

### 10.3 Update User Role
```
FUNCTION UpdateUserRole(userId, newRole):
    INPUT: userId, newRole
    
    // Backend Processing
    PATCH /api/admin/users/:id
    HEADER: Authorization: Bearer <token> (Admin only)
    BODY: { role: newRole }
    
    // Check admin access
    IF currentUser.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
    
    // Validate role
    IF newRole NOT IN ['user', 'admin', 'workspace_owner'] THEN
        RETURN error: "Invalid role"
    END IF
    
    // Find user
    user = FIND User WHERE _id = userId
    
    IF user NOT FOUND THEN
        RETURN error: "User not found"
    END IF
    
    // Update role
    user.role = newRole
    SAVE user
    
    RETURN updated user
END FUNCTION
```

### 10.4 Delete User
```
FUNCTION DeleteUser(userId):
    INPUT: userId
    
    // Backend Processing
    DELETE /api/admin/users/:id
    HEADER: Authorization: Bearer <token> (Admin only)
    
    // Check admin access
    IF currentUser.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
    
    // Prevent self-deletion
    IF userId === currentUser._id THEN
        RETURN error: "Cannot delete your own account"
    END IF
    
    // Find user
    user = FIND User WHERE _id = userId
    
    IF user NOT FOUND THEN
        RETURN error: "User not found"
    END IF
    
    // Delete user
    DELETE user
    
    RETURN success message
END FUNCTION
```

### 10.5 Get All Bookings (Admin)
```
FUNCTION GetAllBookings(filters):
    INPUT: page, limit, status
    
    // Backend Processing
    GET /api/admin/bookings
    HEADER: Authorization: Bearer <token> (Admin only)
    QUERY PARAMS: page, limit, status
    
    // Check admin access
    IF currentUser.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
    
    // Build query
    query = {}
    IF status IS PROVIDED THEN
        query.status = status
    END IF
    
    // Pagination
    page = page OR 1
    limit = limit OR 10
    skip = (page - 1) * limit
    
    bookings = FIND Booking WHERE query
        POPULATE user details
        POPULATE space details
        SORT BY bookingDate DESC
        SKIP skip
        LIMIT limit
    
    total = COUNT Booking WHERE query
    
    RETURN {
        bookings: bookings,
        pagination: {
            total: total,
            page: page,
            limit: limit,
            pages: CEIL(total / limit)
        }
    }
END FUNCTION
```

### 10.6 Update Booking Status (Admin)
```
FUNCTION UpdateBookingStatus(bookingId, newStatus):
    INPUT: bookingId, newStatus
    
    // Backend Processing
    PATCH /api/admin/bookings/:id/status
    HEADER: Authorization: Bearer <token> (Admin only)
    BODY: { status: newStatus }
    
    // Check admin access
    IF currentUser.role !== 'admin' THEN
        RETURN error: "Admin access required"
    END IF
    
    // Find booking
    booking = FIND Booking WHERE _id = bookingId
    
    IF booking NOT FOUND THEN
        RETURN error: "Booking not found"
    END IF
    
    // Validate status
    IF newStatus NOT IN ['pending', 'confirmed', 'cancelled', 'completed'] THEN
        RETURN error: "Invalid status"
    END IF
    
    // Update status
    booking.status = newStatus
    SAVE booking
    
    RETURN updated booking
END FUNCTION
```

---

## 12. Workspace Owner Module

### 11.1 Get Owner Dashboard Stats
```
FUNCTION GetOwnerDashboardStats():

    IF currentUser.role != 'workspace_owner' THEN
        RETURN error: "Workspace owner access required"
    END IF
        
    totalSpaces = COUNT ownerSpaces
    totalBookings = COUNT Booking WHERE space IN spaceIds
    activeBookings = COUNT Booking WHERE space IN spaceIds AND status = 'confirmed'
    
    paidBookings = FIND Booking WHERE space IN spaceIds AND paymentStatus = 'paid'
    totalRevenue = SUM paidBookings.totalAmount
    
    tourRequests = COUNT TourBooking WHERE space IN spaceIds AND status = 'pending'
    
END FUNCTION
```

### 11.2 Get Owner's Spaces
```
FUNCTION GetOwnerSpaces():
    // Backend Processing
    GET /api/owner/spaces
    HEADER: Authorization: Bearer <token> (Owner only)
    
    // Check owner access
    IF currentUser.role NOT IN ['workspace_owner', 'admin'] THEN
        RETURN error: "Workspace owner access required"
    END IF
    
    spaces = FIND Space WHERE owner.id = currentUser._id
        SORT BY createdAt DESC
    
    RETURN spaces
END FUNCTION
```

### 11.3 Get Owner's Bookings
```
FUNCTION GetOwnerBookings():
    // Backend Processing
    GET /api/owner/bookings
    HEADER: Authorization: Bearer <token> (Owner only)
    
    // Check owner access
    IF currentUser.role NOT IN ['workspace_owner', 'admin'] THEN
        RETURN error: "Workspace owner access required"
    END IF
    
    // Get owner's spaces
    ownerSpaces = FIND Space WHERE owner.id = currentUser._id
    spaceIds = EXTRACT _id FROM ownerSpaces
    
    bookings = FIND Booking WHERE space IN spaceIds
        POPULATE user details
        POPULATE space details
        SORT BY bookingDate DESC
    
    RETURN bookings
END FUNCTION
```

### 11.4 Get Owner's Tour Requests
```
FUNCTION GetOwnerTourRequests():
    // Backend Processing
    GET /api/owner/tour-requests
    HEADER: Authorization: Bearer <token> (Owner only)
    
    // Check owner access
    IF currentUser.role NOT IN ['workspace_owner', 'admin'] THEN
        RETURN error: "Workspace owner access required"
    END IF
    
    // Get owner's spaces
    ownerSpaces = FIND Space WHERE owner.id = currentUser._id
    spaceIds = EXTRACT _id FROM ownerSpaces
    
    tourBookings = FIND TourBooking WHERE space IN spaceIds
        POPULATE space details
        SORT BY tourDate DESC
    
    RETURN tourBookings
END FUNCTION
```

---

## Summary

This document provides comprehensive pseudo code for all 12 implemented modules in the WorkNest platform:

1. **Authentication Module** - User registration, login, logout, profile management
2. **User Management Module** - Authentication middleware and role-based access control
3. **Space Management Module** - CRUD operations for workspace listings
4. **Booking Module** - Creating and managing workspace bookings
5. **Tour Booking Module** - Scheduling and managing workspace tours
6. **Payment Module** - Razorpay integration for payment processing
7. **Review Module** - User reviews and rating system
8. **Favorites Module** - Saving and managing favorite workspaces
9. **User Dashboard Module** - User dashboard combining bookings, tours, and favorites
10. **Contact Module** - Contact form submission
11. **Admin Module** - Platform administration and management
12. **Workspace Owner Module** - Owner dashboard and space management

Each module includes detailed pseudo code for all major functions, including input validation, error handling, database operations, and API interactions.