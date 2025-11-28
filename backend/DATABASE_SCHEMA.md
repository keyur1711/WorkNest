# WorkNest Database Schema Documentation

This document describes all database models and their schemas for the WorkNest application.

## Table of Contents
1. [User Model](#user-model)
2. [Space Model](#space-model)
3. [Booking Model](#booking-model)
4. [TourBooking Model](#tourbooking-model)

---

## User Model

**Collection:** `users`

### Schema
```javascript
{
  fullName: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  password: String (required, hashed)
  phone: String (optional, trimmed, validated)
  agreeToTerms: Boolean (default: false)
  role: String (enum: ['user', 'admin'], default: 'user')
  favorites: [ObjectId] (references Space model)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Fields Description
- **fullName**: User's full name
- **email**: Unique email address (used for login)
- **password**: Hashed password using bcrypt
- **phone**: Optional phone number with format validation
- **agreeToTerms**: Boolean indicating if user agreed to terms
- **role**: User role (user or admin)
- **favorites**: Array of Space ObjectIds that user has favorited

### Indexes
- `email` (unique)
- `role`

### Methods
- `toJSON()`: Returns user object without password and __v fields

---

## Space Model

**Collection:** `spaces`

### Schema
```javascript
{
  name: String (required, trimmed)
  city: String (required, trimmed)
  locationText: String (optional, trimmed)
  type: String (required, trimmed)
  pricePerDay: Number (required, min: 0)
  rating: Number (default: 0, min: 0, max: 5)
  capacity: Number (default: 0, min: 0)
  coordinates: {
    lat: Number (required)
    lng: Number (required)
  }
  amenities: [String] (default: [])
  images: [String] (default: [])
  owner: {
    id: String (optional, trimmed)
    name: String (required, trimmed)
    phone: String (optional, trimmed)
  }
  availability: {
    openDays: [String] (default: [])
    openHours: String (optional, trimmed)
  }
  description: String (optional, trimmed)
  featured: Boolean (default: false)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Fields Description
- **name**: Name of the workspace
- **city**: City where workspace is located
- **locationText**: Full address/location text
- **type**: Type of workspace (Hot Desk, Dedicated Desk, Private Office, Meeting Room)
- **pricePerDay**: Price per day in currency units
- **rating**: Average rating (0-5 scale)
- **capacity**: Maximum capacity of the space
- **coordinates**: Latitude and longitude for map display
- **amenities**: Array of available amenities (Wi-Fi, Coffee, Parking, etc.)
- **images**: Array of image URLs
- **owner**: Owner information (id, name, phone)
- **availability**: Opening days and hours
- **description**: Detailed description of the space
- **featured**: Whether the space is featured/promoted

### Indexes
- `city` + `type` (compound)
- `featured`
- `rating` (descending)
- `pricePerDay`
- Text search on `name`, `city`, `type`, `locationText`

---

## Booking Model

**Collection:** `bookings`

### Schema
```javascript
{
  user: ObjectId (required, references User)
  space: ObjectId (required, references Space)
  spaceName: String (required)
  spaceLocation: String (required)
  type: String (enum: ['Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room'], required)
  bookingDate: Date (required, cannot be in past)
  pricePerDay: Number (required, min: 0)
  totalAmount: Number (required, min: 0)
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending')
  paymentStatus: String (enum: ['pending', 'paid', 'refunded'], default: 'pending')
  agreementUrl: String (optional)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Fields Description
- **user**: Reference to User who made the booking
- **space**: Reference to Space being booked
- **spaceName**: Cached name of space (for historical records)
- **spaceLocation**: Cached location of space (for historical records)
- **type**: Type of booking/workspace
- **bookingDate**: Date for which space is booked
- **pricePerDay**: Price per day at time of booking
- **totalAmount**: Total amount for the booking
- **status**: Current status of the booking
- **paymentStatus**: Payment status
- **agreementUrl**: URL to booking agreement document

### Indexes
- `user` + `status` (compound)
- `space` + `bookingDate` (compound)
- `bookingDate`
- `status`

### Validations
- Booking date cannot be in the past
- Price and amount must be non-negative

---

## TourBooking Model

**Collection:** `tourbookings`

### Schema
```javascript
{
  user: ObjectId (required, references User)
  space: ObjectId (required, references Space)
  spaceName: String (required)
  spaceLocation: String (required)
  tourDate: Date (required, cannot be in past)
  tourTime: String (required)
  contactName: String (required)
  contactEmail: String (required, validated email format, lowercase)
  contactPhone: String (required)
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending')
  notes: String (optional)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Fields Description
- **user**: Reference to User requesting the tour
- **space**: Reference to Space for tour
- **spaceName**: Cached name of space
- **spaceLocation**: Cached location of space
- **tourDate**: Date for the tour
- **tourTime**: Time for the tour
- **contactName**: Name of person for tour contact
- **contactEmail**: Email for tour contact (validated)
- **contactPhone**: Phone number for tour contact
- **status**: Current status of tour booking
- **notes**: Additional notes for the tour

### Indexes
- `user` + `status` (compound)
- `space` + `tourDate` (compound)
- `tourDate`
- `status`

### Validations
- Tour date cannot be in the past
- Contact email must be valid format

---

## Relationships

1. **User ↔ Space** (Many-to-Many via favorites)
   - User has many favorite Spaces
   - Space can be favorited by many Users

2. **User ↔ Booking** (One-to-Many)
   - User can have many Bookings
   - Each Booking belongs to one User

3. **Space ↔ Booking** (One-to-Many)
   - Space can have many Bookings
   - Each Booking is for one Space

4. **User ↔ TourBooking** (One-to-Many)
   - User can have many TourBookings
   - Each TourBooking belongs to one User

5. **Space ↔ TourBooking** (One-to-Many)
   - Space can have many TourBookings
   - Each TourBooking is for one Space

---

## Status Values

### Booking Status
- `pending`: Booking is created but not yet confirmed
- `confirmed`: Booking is confirmed and active
- `cancelled`: Booking has been cancelled
- `completed`: Booking has been completed

### Payment Status
- `pending`: Payment not yet received
- `paid`: Payment has been received
- `refunded`: Payment has been refunded

---

## Data Types

- **ObjectId**: MongoDB ObjectId for references
- **Date**: JavaScript Date objects (stored as ISODate in MongoDB)
- **String**: Text fields (many are trimmed)
- **Number**: Numeric values
- **Boolean**: True/false values
- **Array**: Lists of values
- **Object**: Nested objects (subdocuments)

---

## Notes

- All models use MongoDB's built-in `timestamps: true` which automatically adds `createdAt` and `updatedAt` fields
- Password fields are hashed using bcryptjs before storage
- Email fields are normalized to lowercase
- Text fields are trimmed to remove leading/trailing whitespace
- All models include appropriate indexes for query performance
- Foreign key relationships use Mongoose populate for data retrieval

