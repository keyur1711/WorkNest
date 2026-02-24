# WorkNest - Pseudo Code Summary for PPT Presentation

## Module 1: Authentication Module

### Registration
```
FUNCTION RegisterUser():
    VALIDATE password match and terms agreement
    CHECK if email already exists
    HASH password using bcrypt
    CREATE user in database
    GENERATE JWT token
    SAVE token to localStorage
    REDIRECT based on user role
```

### Login
```
FUNCTION LoginUser():
    FIND user by email
    VERIFY password using bcrypt
    VALIDATE user role
    GENERATE JWT token
    SAVE token to localStorage
    REDIRECT to appropriate dashboard
```

---

## Module 2: Space Management Module

### Get Spaces with Filters
```
FUNCTION GetSpaces():
    BUILD query from filters (city, type, price, search)
    EXECUTE database query with pagination
    RETURN spaces with pagination info
```

### Create Space
```
FUNCTION CreateSpace():
    VALIDATE required fields
    CREATE space document with owner info
    SAVE to database
    RETURN created space
```

### Update/Delete Space
```
FUNCTION UpdateSpace():
    FIND space by ID
    CHECK ownership (unless admin)
    UPDATE space fields
    SAVE changes

FUNCTION DeleteSpace():
    FIND space by ID
    CHECK ownership (unless admin)
    DELETE space
```

---

## Module 3: Booking Module

### Create Booking
```
FUNCTION CreateBooking():
    VALIDATE booking date (not in past)
    FIND space by ID
    CREATE booking with status 'pending'
    SET payment status 'pending'
    RETURN booking
```

### Get User Bookings
```
FUNCTION GetUserBookings():
    FIND all bookings for current user
    POPULATE space details
    SORT by booking date
    RETURN bookings list
```

### Cancel Booking
```
FUNCTION CancelBooking():
    FIND booking by ID
    CHECK ownership
    UPDATE status to 'cancelled'
    SAVE changes
```

---

## Module 4: Tour Booking Module

### Create Tour Booking
```
FUNCTION CreateTourBooking():
    VALIDATE tour date (not in past)
    FIND space by ID
    CREATE tour booking with contact details
    SET status 'pending'
    RETURN tour booking
```

### Get Tour Bookings
```
FUNCTION GetTourBookings():
    FIND all tour bookings for user
    POPULATE space details
    SORT by tour date
    RETURN tour bookings
```

---

## Module 5: Payment Module

### Create Payment Order
```
FUNCTION CreatePaymentOrder():
    FIND booking by ID
    CHECK if already paid or cancelled
    VALIDATE amount
    CREATE Razorpay order
    CREATE/UPDATE payment record
    UPDATE booking with order ID
    RETURN order details
```

### Verify Payment
```
FUNCTION VerifyPayment():
    FIND booking by ID
    VERIFY Razorpay signature
    FETCH payment from Razorpay API
    CHECK payment status
    UPDATE booking payment status to 'paid'
    UPDATE booking status to 'confirmed'
    UPDATE payment record
    RETURN success
```

---

## Module 6: Review Module

### Create Review
```
FUNCTION CreateReview():
    CHECK user role (only users can review)
    FIND booking by ID
    VERIFY booking ownership
    CHECK if booking is paid/completed
    CHECK if already reviewed
    CREATE review document
    UPDATE booking with review info
    UPDATE space rating
    RETURN review
```

### Update Space Rating
```
FUNCTION UpdateSpaceRating():
    AGGREGATE all published reviews for space
    CALCULATE average rating
    COUNT total reviews
    UPDATE space with new rating
```

---

## Module 7: Favorites Module

### Add to Favorites
```
FUNCTION AddToFavorites():
    FIND space by ID
    FIND current user
    CHECK if already in favorites
    ADD space ID to user.favorites array
    SAVE user
    RETURN updated favorites
```

### Remove from Favorites
```
FUNCTION RemoveFromFavorites():
    FIND current user
    CHECK if space in favorites
    REMOVE space ID from user.favorites
    SAVE user
    RETURN updated favorites
```

---

## Module 9: User Dashboard Module

### Load Dashboard Data
```
FUNCTION LoadDashboardData():
    CHECK user authentication
    LOAD bookings, tour bookings, favorites in parallel
    HANDLE errors gracefully
    RETURN combined data
```

### Calculate Statistics
```
FUNCTION CalculateDashboardStats():
    COUNT total bookings, saved spaces, tour requests
    FILTER upcoming bookings (not cancelled, future dates)
    FILTER upcoming tours (not cancelled, future dates)
    LIMIT to top 3 bookings and 2 tours
    RETURN statistics
```

### Display Dashboard
```
FUNCTION DisplayDashboard():
    LOAD dashboard data
    CALCULATE statistics
    DISPLAY welcome message
    DISPLAY statistics cards (bookings, favorites, tours)
    DISPLAY upcoming bookings list
    DISPLAY upcoming tours list
    DISPLAY quick action links
```

---

## Module 10: Contact Module

### Submit Contact Form
```
FUNCTION SubmitContactForm():
    VALIDATE required fields (name, email, message)
    VALIDATE email format
    LOG contact submission
    RETURN success message
```

---

## Module 11: Admin Module

### Get Platform Statistics
```
FUNCTION GetPlatformStats():
    COUNT total users, spaces, bookings
    COUNT active and pending bookings
    CALCULATE total revenue from paid bookings
    COUNT recent bookings (last 7 days)
    RETURN statistics object
```

### User Management
```
FUNCTION GetAllUsers():
    BUILD query with optional role filter
    FIND users with pagination
    RETURN users list

FUNCTION UpdateUserRole():
    VALIDATE new role
    FIND user by ID
    UPDATE user role
    SAVE changes

FUNCTION DeleteUser():
    PREVENT self-deletion
    FIND user by ID
    DELETE user
```

### Booking Management
```
FUNCTION GetAllBookings():
    BUILD query with optional status filter
    FIND bookings with pagination
    POPULATE user and space details
    RETURN bookings list

FUNCTION UpdateBookingStatus():
    FIND booking by ID
    VALIDATE new status
    UPDATE booking status
    SAVE changes
```

---

## Module 12: Workspace Owner Module

### Get Owner Dashboard
```
FUNCTION GetOwnerDashboard():
    FIND all spaces owned by user
    COUNT bookings for owner's spaces
    CALCULATE revenue from paid bookings
    COUNT pending tour requests
    RETURN dashboard statistics
```

### Get Owner's Spaces/Bookings
```
FUNCTION GetOwnerSpaces():
    FIND all spaces WHERE owner.id = currentUser._id
    RETURN spaces list

FUNCTION GetOwnerBookings():
    FIND all spaces owned by user
    FIND bookings for those spaces
    POPULATE user and space details
    RETURN bookings list
```

---

## Key Features Summary

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (user, workspace_owner, admin)
- Password hashing with bcrypt
- Protected routes middleware

### Core Functionality
- User dashboard with statistics and overview
- Space browsing with advanced filters
- Booking system with payment integration
- Tour booking system
- Review and rating system
- Favorites management

### Payment Integration
- Razorpay payment gateway
- Order creation and verification
- Payment status tracking
- Auto-reconciliation

### Admin Features
- Platform statistics dashboard
- User management (CRUD operations)
- Space management
- Booking management
- Tour booking management

### Owner Features
- Space creation and management
- Booking and tour request viewing
- Revenue tracking
- Dashboard statistics

---

## Database Models

### User Model
- fullName, email, password, phone, role, favorites[]

### Space Model
- name, city, type, pricePerDay, rating, coordinates, amenities, owner{}, availability{}

### Booking Model
- user, space, bookingDate, totalAmount, status, paymentStatus, razorpayOrderId

### TourBooking Model
- user, space, tourDate, tourTime, contactInfo, status

### Payment Model
- booking, amount, razorpayOrderId, razorpayPaymentId, status

### Review Model
- space, booking, user, rating, comment, status

---

## API Endpoints Summary

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PATCH /api/auth/me

### Spaces
- GET /api/spaces (with filters)
- GET /api/spaces/:id
- POST /api/spaces
- PATCH /api/spaces/:id
- DELETE /api/spaces/:id

### Bookings
- POST /api/bookings
- GET /api/bookings/my-bookings
- PATCH /api/bookings/:id/cancel

### Tour Bookings
- POST /api/bookings/tours
- GET /api/bookings/tours/my-tours

### Payments
- POST /api/payments/create-order
- POST /api/payments/verify-payment
- GET /api/payments/status/:bookingId

### Reviews
- POST /api/reviews
- GET /api/reviews/booking/:bookingId

### Favorites
- GET /api/favorites
- POST /api/favorites/:spaceId
- DELETE /api/favorites/:spaceId

### User Dashboard
- GET /api/bookings/my-bookings (used by dashboard)
- GET /api/bookings/tours/my-tours (used by dashboard)
- GET /api/favorites (used by dashboard)

### Contact
- POST /api/contact

### Admin
- GET /api/admin/stats
- GET /api/admin/users
- PATCH /api/admin/users/:id
- DELETE /api/admin/users/:id
- GET /api/admin/bookings
- PATCH /api/admin/bookings/:id/status

### Owner
- GET /api/owner/dashboard
- GET /api/owner/spaces
- GET /api/owner/bookings
- GET /api/owner/tour-requests

