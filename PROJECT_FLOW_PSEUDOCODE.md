# WorkNest Project Flow - Pseudo Code Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [User Roles & Types](#user-roles--types)
3. [System Architecture](#system-architecture)
4. [Authentication Flow](#authentication-flow)
5. [User Flow (Regular User)](#user-flow-regular-user)
6. [Workspace Owner Flow](#workspace-owner-flow)
7. [Admin Flow](#admin-flow)
8. [Database Models](#database-models)
9. [API Endpoints](#api-endpoints)
10. [Frontend Routes](#frontend-routes)
11. [Complete System Flow](#complete-system-flow)

---

## Project Overview

```
WorkNest is a co-working space booking platform that connects:
- Users (who book workspaces)
- Workspace Owners (who list and manage their spaces)
- Admins (who manage the entire platform)

Technology Stack:
- Frontend: React.js with React Router
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose ODM)
- Authentication: JWT (JSON Web Tokens)
```

---

## User Roles & Types

```
ROLES:
1. USER (default)
   - Can browse and search workspaces
   - Can book workspaces
   - Can request tours
   - Can add favorites
   - Can view booking history
   - Dashboard: /dashboard

2. WORKSPACE_OWNER
   - All USER capabilities
   - Can create and manage their own workspaces
   - Can view bookings for their spaces
   - Can view tour requests for their spaces
   - Dashboard: /workspace-owner

3. ADMIN
   - Full platform access
   - Can manage all users
   - Can manage all spaces
   - Can manage all bookings
   - Can view platform statistics
   - Dashboard: /admin
```

---

## System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   FRONTEND      │         │    BACKEND      │         │    DATABASE     │
│   (React)       │◄───────►│   (Express)     │◄───────►│   (MongoDB)     │
│   Port: 3000    │  HTTP   │   Port: 5000    │  Mongoose│   (Atlas)      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Authentication Flow

### REGISTRATION FLOW

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
    
    // Role Selection (only user or workspace_owner allowed)
    IF role NOT IN ['user', 'workspace_owner'] THEN
        role = 'user'  // Default to user
    END IF
    
    // Send to Backend
    POST /api/auth/register
    {
        fullName, email, password, phone, role, agreeToTerms
    }
    
    // Backend Processing
    IF email already exists THEN
        RETURN error: "Email already registered"
    END IF
    
    hashedPassword = bcrypt.hash(password, 12)
    
    user = CREATE User {
        fullName,
        email,
        password: hashedPassword,
        phone,
        role: role OR 'user',
        agreeToTerms: true
    }
    
    token = jwt.sign({ id: user._id, email, role }, JWT_SECRET)
    
    // Save to localStorage
    localStorage.setItem('wn:auth', {
        user: user.toJSON(),
        token: token
    })
    
    // Redirect based on role
    IF user.role === 'workspace_owner' THEN
        REDIRECT to /workspace-owner
    ELSE
        REDIRECT to /dashboard
    END IF
END FUNCTION
```

### LOGIN FLOW

```
FUNCTION LoginUser(credentials):
    INPUT: email, password, role (optional, only for user/workspace_owner)
    
    // Frontend: Show role selection (only user and workspace_owner)
    // Admin doesn't need role selection
    
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
    
    IF bcrypt.compare(password, user.password) === false THEN
        RETURN error: "Invalid email or password"
    END IF
    
    // Role Validation (only for non-admin users)
    IF role IS PROVIDED AND user.role !== 'admin' THEN
        IF user.role !== role THEN
            RETURN error: "Invalid role selection"
        END IF
    END IF
    
    token = jwt.sign({ id: user._id, email, role: user.role }, JWT_SECRET)
    
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

### AUTHENTICATION MIDDLEWARE

```
FUNCTION AuthenticateRequest(request):
    token = EXTRACT token FROM Authorization header
    
    IF token NOT FOUND THEN
        RETURN error: "Authorization token missing"
    END IF
    
    decoded = jwt.verify(token, JWT_SECRET)
    user = FIND User WHERE _id = decoded.id
    
    IF user NOT FOUND THEN
        RETURN error: "User not found"
    END IF
    
    // Attach user info to request
    request.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    }
    
    RETURN next()
END FUNCTION

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

## User Flow (Regular User)

```
FUNCTION UserJourney():
    // 1. REGISTRATION/LOGIN
    IF user is new THEN
        REGISTER with role = 'user'
        REDIRECT to /dashboard
    ELSE
        LOGIN with role = 'user'
        REDIRECT to /dashboard
    END IF
    
    // 2. BROWSE SPACES
    GET /api/spaces
    PARAMETERS: city, type, minPrice, maxPrice, search, page, limit, sort
    DISPLAY spaces in Search page
    
    // 3. VIEW SPACE DETAILS
    GET /api/spaces/:id
    DISPLAY space details, amenities, location on map
    OPTIONS: Book Now, Request Tour, Add to Favorites
    
    // 4. ADD TO FAVORITES
    IF user clicks "Add to Favorites" THEN
        POST /api/favorites/:spaceId
        ADD spaceId to user.favorites array
        UPDATE favorites list
    END IF
    
    // 5. BOOK A SPACE
    IF user clicks "Book Now" THEN
        INPUT: bookingDate, type
        POST /api/bookings
        {
            spaceId, type, bookingDate
        }
        CREATE Booking {
            user: currentUser._id,
            space: spaceId,
            spaceName, spaceLocation, type,
            bookingDate,
            pricePerDay: space.pricePerDay,
            totalAmount: space.pricePerDay,
            status: 'pending',
            paymentStatus: 'pending'
        }
        REDIRECT to booking confirmation
    END IF
    
    // 6. REQUEST TOUR
    IF user clicks "Request Tour" THEN
        INPUT: tourDate, tourTime, contactName, contactEmail, contactPhone, notes
        POST /api/bookings/tours
        CREATE TourBooking {
            user: currentUser._id,
            space: spaceId,
            spaceName, spaceLocation,
            tourDate, tourTime,
            contactName, contactEmail, contactPhone,
            status: 'pending',
            notes
        }
    END IF
    
    // 7. VIEW DASHBOARD
    GET /api/bookings/my-bookings
    GET /api/bookings/tours/my-tours
    GET /api/favorites
    DISPLAY:
        - Upcoming bookings
        - Upcoming tours
        - Favorite spaces
        - Booking statistics
    
    // 8. VIEW BOOKING HISTORY
    GET /api/bookings/my-bookings
    DISPLAY all bookings with status (pending, confirmed, cancelled, completed)
    
    // 9. CANCEL BOOKING
    IF user clicks "Cancel Booking" THEN
        PATCH /api/bookings/:id/cancel
        UPDATE booking.status = 'cancelled'
    END IF
    
    // 10. MANAGE PROFILE
    GET /api/auth/me
    PATCH /api/auth/me
    UPDATE: fullName, email, phone
END FUNCTION
```

---

## Workspace Owner Flow

```
FUNCTION WorkspaceOwnerJourney():
    // 1. REGISTRATION/LOGIN
    IF owner is new THEN
        REGISTER with role = 'workspace_owner'
        REDIRECT to /workspace-owner
    ELSE
        LOGIN with role = 'workspace_owner'
        REDIRECT to /workspace-owner
    END IF
    
    // 2. WORKSPACE OWNER DASHBOARD
    GET /api/spaces (all spaces)
    GET /api/bookings (all bookings)
    GET /api/bookings/tours (all tour bookings)
    DISPLAY:
        - Total spaces owned
        - Total bookings
        - Active bookings
        - Total revenue
        - Tour requests
    
    // 3. CREATE NEW SPACE
    IF owner clicks "Add New Space" THEN
        INPUT: name, city, locationText, type, pricePerDay, capacity,
               coordinates (lat, lng), amenities, images, description,
               availability (openDays, openHours)
        POST /api/spaces
        CREATE Space {
            name, city, locationText, type, pricePerDay, rating: 0,
            capacity, coordinates, amenities, images,
            owner: { name: owner.fullName, phone: owner.phone },
            availability, description, featured: false
        }
        ADD to spaces list
    END IF
    
    // 4. MANAGE SPACES
    GET /api/spaces
    DISPLAY all spaces with:
        - Space name, city, type
        - Price per day
        - Rating
        - Actions: Edit, Delete
    
    // 5. UPDATE SPACE
    IF owner clicks "Edit Space" THEN
        PATCH /api/spaces/:id
        UPDATE space fields (name, pricePerDay, rating, etc.)
    END IF
    
    // 6. DELETE SPACE
    IF owner clicks "Delete Space" THEN
        DELETE /api/spaces/:id
        REMOVE space from database
    END IF
    
    // 7. VIEW BOOKINGS FOR OWNER'S SPACES
    GET /api/bookings
    FILTER bookings WHERE space.owner matches current owner
    DISPLAY:
        - User information
        - Booking date
        - Total amount
        - Status (pending, confirmed, cancelled, completed)
    
    // 8. VIEW TOUR REQUESTS
    GET /api/bookings/tours
    FILTER tour bookings WHERE space.owner matches current owner
    DISPLAY:
        - Contact information
        - Tour date and time
        - Status (pending, confirmed, cancelled, completed)
        - Notes
    
    // 9. UPDATE BOOKING STATUS (if needed)
    // Note: Usually handled by admin, but owner can view
END FUNCTION
```

---

## Admin Flow

```
FUNCTION AdminJourney():
    // 1. LOGIN (No role selection needed)
    LOGIN with admin credentials
    REDIRECT to /admin
    
    // 2. ADMIN DASHBOARD - STATISTICS
    GET /api/admin/stats
    DISPLAY:
        - Total Users
        - Total Spaces
        - Total Bookings
        - Total Tour Bookings
        - Active Bookings
        - Pending Bookings
        - Workspace Owners count
        - Total Revenue (sum of paid bookings)
        - Recent Bookings (last 7 days)
    
    // 3. USER MANAGEMENT
    GET /api/admin/users
    PARAMETERS: page, limit, role (optional filter)
    DISPLAY table with:
        - Name, Email, Role
        - Actions: Update Role, Delete User
    
    // Update User Role
    PATCH /api/admin/users/:id
    UPDATE user.role TO ['user', 'admin', 'workspace_owner']
    
    // Delete User
    IF admin clicks "Delete User" THEN
        IF user._id === currentAdmin._id THEN
            RETURN error: "Cannot delete your own account"
        END IF
        DELETE /api/admin/users/:id
        REMOVE user from database
    END IF
    
    // 4. SPACE MANAGEMENT
    GET /api/admin/spaces
    PARAMETERS: page, limit, city, type
    DISPLAY all spaces with:
        - Space name, city, type
        - Price per day
        - Actions: View, Delete
    
    // Create Space (Admin can create any space)
    POST /api/admin/spaces
    CREATE Space (same as workspace owner)
    
    // Update Space
    PATCH /api/admin/spaces/:id
    UPDATE space fields
    
    // Delete Space
    DELETE /api/admin/spaces/:id
    REMOVE space from database
    
    // 5. BOOKING MANAGEMENT
    GET /api/admin/bookings
    PARAMETERS: page, limit, status (optional filter)
    DISPLAY all bookings with:
        - User information
        - Space information
        - Booking date
        - Total amount
        - Status dropdown (pending, confirmed, cancelled, completed)
    
    // Update Booking Status
    PATCH /api/admin/bookings/:id/status
    UPDATE booking.status TO new status
    
    // 6. TOUR BOOKING MANAGEMENT
    GET /api/admin/tour-bookings
    PARAMETERS: page, limit, status (optional filter)
    DISPLAY all tour bookings with:
        - User information
        - Space information
        - Tour date and time
        - Contact information
        - Status dropdown
    
    // Update Tour Booking Status
    PATCH /api/admin/tour-bookings/:id/status
    UPDATE tourBooking.status TO new status
END FUNCTION
```

---

## Database Models

### USER MODEL

```
MODEL User {
    _id: ObjectId (auto-generated)
    fullName: String (required, trimmed)
    email: String (required, unique, lowercase, trimmed)
    password: String (required, hashed with bcrypt)
    phone: String (optional, validated format)
    agreeToTerms: Boolean (default: false)
    role: String (enum: ['user', 'admin', 'workspace_owner'], default: 'user')
    favorites: [ObjectId] (references Space model)
    createdAt: Date (auto-generated)
    updatedAt: Date (auto-generated)
    
    INDEXES:
        - email (unique)
        - role
    
    METHODS:
        toJSON() // Returns user without password and __v
}
```

### SPACE MODEL

```
MODEL Space {
    _id: ObjectId (auto-generated)
    name: String (required, trimmed)
    city: String (required, trimmed)
    locationText: String (optional, trimmed)
    type: String (required, trimmed) // Hot Desk, Dedicated Desk, Private Office, Meeting Room
    pricePerDay: Number (required, min: 0)
    rating: Number (default: 0, min: 0, max: 5)
    capacity: Number (default: 0, min: 0)
    coordinates: {
        lat: Number (required)
        lng: Number (required)
    }
    amenities: [String] (default: []) // Wi-Fi, Coffee, Parking, etc.
    images: [String] (default: [])
    owner: {
        id: String (optional)
        name: String (required)
        phone: String (optional)
    }
    availability: {
        openDays: [String] (default: [])
        openHours: String (optional)
    }
    description: String (optional)
    featured: Boolean (default: false)
    createdAt: Date (auto-generated)
    updatedAt: Date (auto-generated)
    
    INDEXES:
        - city + type (compound)
        - featured
        - rating (descending)
        - pricePerDay
        - Text search on name, city, type, locationText
}
```

### BOOKING MODEL

```
MODEL Booking {
    _id: ObjectId (auto-generated)
    user: ObjectId (required, references User)
    space: ObjectId (required, references Space)
    spaceName: String (required)
    spaceLocation: String (required)
    type: String (enum: ['Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room'])
    bookingDate: Date (required, cannot be in past)
    pricePerDay: Number (required, min: 0)
    totalAmount: Number (required, min: 0)
    status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending')
    paymentStatus: String (enum: ['pending', 'paid', 'refunded'], default: 'pending')
    agreementUrl: String (optional)
    createdAt: Date (auto-generated)
    updatedAt: Date (auto-generated)
    
    INDEXES:
        - user + status (compound)
        - space + bookingDate (compound)
        - bookingDate
        - status
}
```

### TOUR BOOKING MODEL

```
MODEL TourBooking {
    _id: ObjectId (auto-generated)
    user: ObjectId (required, references User)
    space: ObjectId (required, references Space)
    spaceName: String (required)
    spaceLocation: String (required)
    tourDate: Date (required, cannot be in past)
    tourTime: String (required)
    contactName: String (required)
    contactEmail: String (required, validated)
    contactPhone: String (required)
    status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending')
    notes: String (optional)
    createdAt: Date (auto-generated)
    updatedAt: Date (auto-generated)
    
    INDEXES:
        - user + status (compound)
        - space + tourDate (compound)
        - tourDate
        - status
}
```

---

## API Endpoints

### AUTHENTICATION ENDPOINTS

```
POST /api/auth/register
    INPUT: fullName, email, password, confirmPassword, phone, role, agreeToTerms
    OUTPUT: { user, token }
    VALIDATION: Email format, password length, role enum

POST /api/auth/login
    INPUT: email, password, role (optional)
    OUTPUT: { user, token }
    VALIDATION: Email format, password match, role validation

GET /api/auth/me
    AUTH: Required (Bearer token)
    OUTPUT: { user }
    RETURNS: Current authenticated user

PATCH /api/auth/me
    AUTH: Required
    INPUT: fullName, email, phone
    OUTPUT: { user }
    UPDATES: User profile information
```

### SPACES ENDPOINTS

```
GET /api/spaces
    QUERY: city, type, minPrice, maxPrice, search, page, limit, sort
    OUTPUT: { data: [spaces], pagination: { total, page, limit, pages } }
    ACCESS: Public

GET /api/spaces/filters
    OUTPUT: { cities: [String], types: [String] }
    ACCESS: Public

GET /api/spaces/:id
    OUTPUT: { space }
    ACCESS: Public

POST /api/spaces
    AUTH: Required
    INPUT: name, city, type, pricePerDay, coordinates, amenities, etc.
    OUTPUT: { space }
    ACCESS: Authenticated users

PATCH /api/spaces/:id
    AUTH: Required
    INPUT: name, pricePerDay, rating, etc.
    OUTPUT: { space }
    ACCESS: Authenticated users

DELETE /api/spaces/:id
    AUTH: Required
    OUTPUT: { message: "Space deleted successfully" }
    ACCESS: Authenticated users
```

### BOOKINGS ENDPOINTS

```
POST /api/bookings
    AUTH: Required
    INPUT: spaceId, type, bookingDate
    OUTPUT: { booking }
    CREATES: New booking with status 'pending'

GET /api/bookings/my-bookings
    AUTH: Required
    OUTPUT: { bookings: [Booking] }
    RETURNS: All bookings for current user

GET /api/bookings/:id
    AUTH: Required
    OUTPUT: { booking }
    ACCESS: Booking owner or admin

PATCH /api/bookings/:id/cancel
    AUTH: Required
    OUTPUT: { booking }
    UPDATES: booking.status = 'cancelled'
    ACCESS: Booking owner

POST /api/bookings/tours
    AUTH: Required
    INPUT: spaceId, tourDate, tourTime, contactName, contactEmail, contactPhone, notes
    OUTPUT: { tourBooking }
    CREATES: New tour booking with status 'pending'

GET /api/bookings/tours/my-tours
    AUTH: Required
    OUTPUT: { tourBookings: [TourBooking] }
    RETURNS: All tour bookings for current user
```

### FAVORITES ENDPOINTS

```
GET /api/favorites
    AUTH: Required
    OUTPUT: { favorites: [Space] }
    RETURNS: All favorited spaces for current user

POST /api/favorites/:spaceId
    AUTH: Required
    OUTPUT: { favorites: [Space] }
    ADDS: spaceId to user.favorites array

DELETE /api/favorites/:spaceId
    AUTH: Required
    OUTPUT: { favorites: [Space] }
    REMOVES: spaceId from user.favorites array
```

### ADMIN ENDPOINTS

```
GET /api/admin/stats
    AUTH: Required (Admin only)
    OUTPUT: { stats: { totalUsers, totalSpaces, totalBookings, ... } }

GET /api/admin/users
    AUTH: Required (Admin only)
    QUERY: page, limit, role
    OUTPUT: { users: [User], pagination: {...} }

GET /api/admin/users/:id
    AUTH: Required (Admin only)
    OUTPUT: { user }

PATCH /api/admin/users/:id
    AUTH: Required (Admin only)
    INPUT: fullName, email, role, phone
    OUTPUT: { user }

DELETE /api/admin/users/:id
    AUTH: Required (Admin only)
    OUTPUT: { message: "User deleted successfully" }

GET /api/admin/spaces
    AUTH: Required (Admin only)
    QUERY: page, limit, city, type
    OUTPUT: { spaces: [Space], pagination: {...} }

POST /api/admin/spaces
    AUTH: Required (Admin only)
    INPUT: Space data
    OUTPUT: { space }

PATCH /api/admin/spaces/:id
    AUTH: Required (Admin only)
    INPUT: Space update data
    OUTPUT: { space }

DELETE /api/admin/spaces/:id
    AUTH: Required (Admin only)
    OUTPUT: { message: "Space deleted successfully" }

GET /api/admin/bookings
    AUTH: Required (Admin only)
    QUERY: page, limit, status
    OUTPUT: { bookings: [Booking], pagination: {...} }

PATCH /api/admin/bookings/:id/status
    AUTH: Required (Admin only)
    INPUT: { status }
    OUTPUT: { booking }

GET /api/admin/tour-bookings
    AUTH: Required (Admin only)
    QUERY: page, limit, status
    OUTPUT: { tourBookings: [TourBooking], pagination: {...} }

PATCH /api/admin/tour-bookings/:id/status
    AUTH: Required (Admin only)
    INPUT: { status }
    OUTPUT: { tourBooking }
```

---

## Frontend Routes

```
ROUTE STRUCTURE:

PUBLIC ROUTES:
    /                    → Home page
    /search              → Search spaces (with filters)
    /spaces/:id          → Space details page
    /pricing             → Pricing information
    /locations           → Locations page
    /about               → About page
    /contact             → Contact page
    /login               → Login page (with role selection)
    /register            → Register page (with role selection)

PROTECTED ROUTES (Require Authentication):
    /dashboard           → User dashboard (role: user)
        - Shows bookings, tours, favorites
        - Quick stats
        - Upcoming bookings
    
    /workspace-owner     → Workspace Owner dashboard (role: workspace_owner)
        - Manage spaces
        - View bookings for their spaces
        - View tour requests
        - Statistics
    
    /admin               → Admin dashboard (role: admin)
        - User management
        - Space management
        - Booking management
        - Tour booking management
        - Platform statistics
    
    /favorites            → User's favorite spaces (role: user, workspace_owner)
    /profile              → User profile management (all roles)
    /bookings             → Booking history (all roles)
```

---

## Complete System Flow

### APPLICATION STARTUP

```
FUNCTION InitializeApplication():
    // Backend Startup
    CONNECT to MongoDB database
    LOAD environment variables (.env)
    SETUP Express middleware (CORS, JSON parser, cookie parser, morgan)
    REGISTER routes:
        - /api/auth → authRoutes
        - /api/spaces → spaceRoutes
        - /api/bookings → bookingRoutes
        - /api/favorites → favoritesRoutes
        - /api/admin → adminRoutes (protected with admin middleware)
    START server on PORT 5000
    
    // Frontend Startup
    INITIALIZE React application
    SETUP React Router with routes
    WRAP application with AuthProvider
    CHECK localStorage for existing auth token
    IF token exists THEN
        VALIDATE token with backend
        IF valid THEN
            SET authenticated state
            LOAD user data
        ELSE
            CLEAR localStorage
        END IF
    END IF
    RENDER application
END FUNCTION
```

### COMPLETE USER JOURNEY (Regular User)

```
FUNCTION CompleteUserJourney():
    // STEP 1: Landing Page
    USER visits /
    DISPLAY Home page with:
        - Hero section
        - Featured spaces
        - Features list
        - Call to action buttons
    
    // STEP 2: Registration
    USER clicks "Sign Up"
    REDIRECT to /register
    USER fills form:
        - Full Name
        - Email
        - Phone
        - Password
        - Confirm Password
        - Role: Select "User"
        - Agree to Terms
    SUBMIT form
    BACKEND creates user account
    FRONTEND receives token and user data
    SAVE to localStorage
    REDIRECT to /dashboard
    
    // STEP 3: Dashboard
    LOAD dashboard data:
        - GET /api/bookings/my-bookings
        - GET /api/bookings/tours/my-tours
        - GET /api/favorites
    DISPLAY:
        - Welcome message
        - Total bookings count
        - Saved spaces count
        - Tour requests count
        - Upcoming bookings (next 3)
        - Upcoming tours (next 2)
    
    // STEP 4: Search Spaces
    USER clicks "Search" or navigates to /search
    DISPLAY search page with filters:
        - City dropdown
        - Type dropdown
        - Price range slider
        - Search bar
    USER applies filters
    GET /api/spaces?city=X&type=Y&minPrice=Z&maxPrice=W
    DISPLAY filtered spaces in grid/list
    
    // STEP 5: View Space Details
    USER clicks on a space card
    REDIRECT to /spaces/:id
    GET /api/spaces/:id
    DISPLAY:
        - Space images
        - Name, city, type
        - Price per day
        - Rating
        - Amenities list
        - Description
        - Map with location
        - Availability
    OPTIONS:
        - Book Now button
        - Request Tour button
        - Add to Favorites button
    
    // STEP 6A: Book Space
    USER clicks "Book Now"
    OPEN booking modal/form
    INPUT: bookingDate, type
    VALIDATE: date not in past
    POST /api/bookings
    {
        spaceId, type, bookingDate
    }
    BACKEND creates booking with status 'pending'
    DISPLAY success message
    REDIRECT to /bookings or show confirmation
    
    // STEP 6B: Request Tour
    USER clicks "Request Tour"
    OPEN tour request modal/form
    INPUT: tourDate, tourTime, contactName, contactEmail, contactPhone, notes
    POST /api/bookings/tours
    BACKEND creates tour booking with status 'pending'
    DISPLAY success message
    
    // STEP 6C: Add to Favorites
    USER clicks "Add to Favorites"
    POST /api/favorites/:spaceId
    BACKEND adds spaceId to user.favorites
    UPDATE UI to show "Remove from Favorites"
    
    // STEP 7: View Favorites
    USER navigates to /favorites
    GET /api/favorites
    DISPLAY all favorited spaces
    OPTIONS: Remove from favorites, View details, Book
    
    // STEP 8: View Booking History
    USER navigates to /bookings
    GET /api/bookings/my-bookings
    DISPLAY all bookings with:
        - Space name and image
        - Booking date
        - Total amount
        - Status badge
        - Actions: Cancel (if pending/confirmed)
    
    // STEP 9: Cancel Booking
    USER clicks "Cancel" on a booking
    CONFIRM cancellation
    PATCH /api/bookings/:id/cancel
    BACKEND updates booking.status = 'cancelled'
    REFRESH booking list
    
    // STEP 10: Manage Profile
    USER navigates to /profile
    GET /api/auth/me
    DISPLAY current profile information
    USER updates: fullName, email, phone
    PATCH /api/auth/me
    BACKEND updates user data
    DISPLAY success message
END FUNCTION
```

### COMPLETE WORKSPACE OWNER JOURNEY

```
FUNCTION CompleteWorkspaceOwnerJourney():
    // STEP 1: Registration
    USER registers with role = 'workspace_owner'
    REDIRECT to /workspace-owner
    
    // STEP 2: Workspace Owner Dashboard
    LOAD dashboard:
        - GET /api/spaces (all spaces)
        - GET /api/bookings (all bookings)
        - GET /api/bookings/tours (all tour bookings)
    DISPLAY statistics:
        - Total spaces
        - Total bookings
        - Active bookings
        - Total revenue
        - Tour requests
    
    // STEP 3: Create Space
    CLICK "Add New Space"
    OPEN create space form
    INPUT:
        - Name
        - City
        - Location Text
        - Type (Hot Desk, Dedicated Desk, Private Office, Meeting Room)
        - Price Per Day
        - Capacity
        - Coordinates (lat, lng)
        - Amenities (checkboxes)
        - Images (upload)
        - Description
        - Availability (openDays, openHours)
    POST /api/spaces
    BACKEND creates space
    DISPLAY success message
    REFRESH spaces list
    
    // STEP 4: Manage Spaces
    VIEW all created spaces in "Spaces" tab
    FOR EACH space:
        - Display name, city, type, price
        - Display rating
        - Actions: Edit, Delete
    
    // STEP 5: Update Space
    CLICK "Edit" on a space
    LOAD space data
    UPDATE fields
    PATCH /api/spaces/:id
    BACKEND updates space
    REFRESH spaces list
    
    // STEP 6: Delete Space
    CLICK "Delete" on a space
    CONFIRM deletion
    DELETE /api/spaces/:id
    BACKEND removes space
    REFRESH spaces list
    
    // STEP 7: View Bookings
    CLICK "Bookings" tab
    GET /api/bookings
    FILTER bookings for owner's spaces
    DISPLAY:
        - User information
        - Space name
        - Booking date
        - Total amount
        - Status
    
    // STEP 8: View Tour Requests
    CLICK "Tour Requests" tab
    GET /api/bookings/tours
    FILTER tour bookings for owner's spaces
    DISPLAY:
        - Contact name and email
        - Space name
        - Tour date and time
        - Status
        - Notes
END FUNCTION
```

### COMPLETE ADMIN JOURNEY

```
FUNCTION CompleteAdminJourney():
    // STEP 1: Login (No role selection)
    ADMIN logs in with admin credentials
    REDIRECT to /admin
    
    // STEP 2: View Statistics
    GET /api/admin/stats
    DISPLAY dashboard with:
        - Total Users
        - Total Spaces
        - Total Bookings
        - Total Tour Bookings
        - Active Bookings
        - Pending Bookings
        - Workspace Owners count
        - Total Revenue
        - Recent Bookings (7 days)
    
    // STEP 3: Manage Users
    CLICK "Users" tab
    GET /api/admin/users?page=1&limit=10
    DISPLAY table with:
        - Name
        - Email
        - Role (dropdown to change)
        - Actions (Delete)
    
    // Update User Role
    SELECT new role from dropdown
    PATCH /api/admin/users/:id
    BACKEND updates user.role
    REFRESH users list
    
    // Delete User
    CLICK "Delete"
    CONFIRM deletion
    IF user is not current admin THEN
        DELETE /api/admin/users/:id
        BACKEND removes user
        REFRESH users list
    ELSE
        SHOW error: "Cannot delete your own account"
    END IF
    
    // STEP 4: Manage Spaces
    CLICK "Spaces" tab
    GET /api/admin/spaces?page=1&limit=10
    DISPLAY all spaces
    ACTIONS: View, Delete
    
    // Delete Space
    CLICK "Delete"
    CONFIRM deletion
    DELETE /api/admin/spaces/:id
    BACKEND removes space
    REFRESH spaces list
    
    // STEP 5: Manage Bookings
    CLICK "Bookings" tab
    GET /api/admin/bookings?page=1&limit=10
    DISPLAY all bookings with:
        - User information
        - Space information
        - Booking date
        - Total amount
        - Status (dropdown)
    
    // Update Booking Status
    SELECT new status from dropdown
    PATCH /api/admin/bookings/:id/status
    BACKEND updates booking.status
    REFRESH bookings list
    
    // STEP 6: Manage Tour Bookings
    CLICK "Tour Bookings" tab
    GET /api/admin/tour-bookings?page=1&limit=10
    DISPLAY all tour bookings
    UPDATE status via dropdown
    PATCH /api/admin/tour-bookings/:id/status
    BACKEND updates tourBooking.status
    REFRESH tour bookings list
END FUNCTION
```

### ROUTE PROTECTION FLOW

```
FUNCTION RouteProtection():
    // Protected Route Check
    WHEN user navigates to protected route:
        CHECK localStorage for token
        IF token NOT FOUND THEN
            REDIRECT to /login
        ELSE
            VALIDATE token with backend (GET /api/auth/me)
            IF token INVALID THEN
                CLEAR localStorage
                REDIRECT to /login
            ELSE
                CHECK user.role
                IF route === '/admin' AND user.role !== 'admin' THEN
                    REDIRECT to /dashboard
                ELSE IF route === '/workspace-owner' AND user.role !== 'workspace_owner' THEN
                    REDIRECT to /dashboard
                ELSE
                    ALLOW access to route
                END IF
            END IF
        END IF
    END WHEN
END FUNCTION
```

---

## Key Features Summary

```
AUTHENTICATION & AUTHORIZATION:
    ✓ Role-based registration (user, workspace_owner)
    ✓ Role-based login (user, workspace_owner, admin)
    ✓ JWT token-based authentication
    ✓ Protected routes based on role
    ✓ Admin account creation via script/endpoint

USER FEATURES:
    ✓ Browse and search workspaces
    ✓ Filter by city, type, price
    ✓ View space details with map
    ✓ Book workspaces
    ✓ Request tours
    ✓ Add/remove favorites
    ✓ View booking history
    ✓ Cancel bookings
    ✓ Manage profile

WORKSPACE OWNER FEATURES:
    ✓ All user features
    ✓ Create workspaces
    ✓ Update workspaces
    ✓ Delete workspaces
    ✓ View bookings for their spaces
    ✓ View tour requests
    ✓ View statistics (revenue, bookings)

ADMIN FEATURES:
    ✓ View platform statistics
    ✓ Manage all users (view, update role, delete)
    ✓ Manage all spaces (view, create, update, delete)
    ✓ Manage all bookings (view, update status)
    ✓ Manage all tour bookings (view, update status)
    ✓ Full platform control
```

---

## Error Handling

```
FUNCTION HandleErrors():
    // Frontend Error Handling
    TRY {
        API_CALL
    } CATCH (error) {
        IF error.status === 401 THEN
            CLEAR localStorage
            REDIRECT to /login
        ELSE IF error.status === 403 THEN
            DISPLAY error: "Access denied"
            REDIRECT to appropriate dashboard
        ELSE IF error.status === 404 THEN
            DISPLAY error: "Resource not found"
        ELSE IF error.status === 409 THEN
            DISPLAY error: "Conflict (e.g., email already exists)"
        ELSE
            DISPLAY error: "Server error. Please try again."
        END IF
    } END TRY
    
    // Backend Error Handling
    TRY {
        PROCESS_REQUEST
    } CATCH (error) {
        LOG error to console
        IF error.name === 'ValidationError' THEN
            RETURN 400 with validation errors
        ELSE IF error.name === 'MongoServerError' AND error.code === 11000 THEN
            RETURN 409 with "Duplicate key error"
        ELSE
            RETURN 500 with "Server error"
        END IF
    } END TRY
END FUNCTION
```

---

## Security Measures

```
SECURITY IMPLEMENTATIONS:

1. PASSWORD SECURITY:
    - Passwords hashed with bcrypt (12 rounds)
    - Never returned in API responses
    - Minimum 6 characters required

2. AUTHENTICATION:
    - JWT tokens with expiration (7 days)
    - Tokens stored in localStorage
    - Bearer token authentication
    - Token validation on every protected route

3. AUTHORIZATION:
    - Role-based access control (RBAC)
    - Middleware checks for admin/workspace_owner roles
    - Route protection on frontend and backend

4. DATA VALIDATION:
    - Input validation using express-validator
    - Email format validation
    - Phone number format validation
    - Date validation (no past dates)
    - Enum validation for roles and statuses

5. CORS:
    - Configured for specific origin
    - Credentials enabled

6. ERROR HANDLING:
    - Generic error messages to prevent information leakage
    - Detailed logging on backend
```

---

## Database Relationships

```
RELATIONSHIPS:

User → Favorites → Space (Many-to-Many)
    User.favorites = [Space._id, Space._id, ...]

User → Bookings → Space (One-to-Many)
    Booking.user = User._id
    Booking.space = Space._id

User → TourBookings → Space (One-to-Many)
    TourBooking.user = User._id
    TourBooking.space = Space._id

Space → Owner (Embedded)
    Space.owner = { name, phone, id }
    (Owner is workspace_owner user)
```

---

## API Request/Response Flow

```
TYPICAL API REQUEST FLOW:

1. FRONTEND:
    USER action triggers API call
    GET token from localStorage
    ADD Authorization header: "Bearer <token>"
    SEND HTTP request to backend

2. BACKEND MIDDLEWARE:
    EXTRACT token from Authorization header
    VERIFY token with JWT_SECRET
    FIND user in database
    ATTACH user info to request object
    CHECK role if needed (admin/workspace_owner middleware)
    PASS to route handler

3. ROUTE HANDLER:
    VALIDATE input data
    PERFORM database operation
    RETURN response with data

4. FRONTEND:
    RECEIVE response
    UPDATE UI state
    DISPLAY data or error message
```

---

## State Management

```
FRONTEND STATE MANAGEMENT:

AUTHENTICATION STATE (AuthContext):
    - user: Current user object
    - token: JWT token
    - isAuthenticated: Boolean
    - login(): Login function
    - register(): Register function
    - logout(): Logout function
    - refreshUser(): Refresh user data

STORAGE:
    - localStorage key: 'wn:auth'
    - Stores: { user, token }
    - Persists across page refreshes
    - Cleared on logout

COMPONENT STATE:
    - Each page manages its own local state
    - Uses React hooks (useState, useEffect)
    - Fetches data on component mount
    - Updates on user actions
```

---

## End of Pseudo Code Documentation

This document provides a comprehensive overview of the WorkNest project flow,
covering all three user types (User, Workspace Owner, Admin) and their
complete journeys through the application.

