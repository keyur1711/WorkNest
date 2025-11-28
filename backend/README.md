# WorkNest Backend

Express + MongoDB API backing the WorkNest frontend application.

## Prerequisites

- Node.js 18+
- npm 9+
- Access to the MongoDB Atlas cluster provided in the project brief

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Copy the environment template and adjust values as needed:

   ```bash
   cp env.example .env
   ```

   Update `MONGO_URI` and `JWT_SECRET` with secure values if you operate your own cluster.

3. Seed the database with the sample spaces used by the frontend (optional but recommended):

   ```bash
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The API will be available on `http://localhost:5000` by default. Update `CLIENT_URL` in your `.env` if you serve the frontend from another origin.

## Available Scripts

- `npm run dev` – start the server with `nodemon` for hot reloads.
- `npm start` – start the server in production mode.
- `npm run seed` – load the predefined co-working spaces into MongoDB.

## API Overview

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/register` – create a new user (expects `fullName`, `email`, `password`, `confirmPassword`, `phone`, `agreeToTerms`).
- `POST /auth/login` – authenticate and receive a JWT (expects `email`, `password`).
- `GET /auth/me` – get the authenticated user (requires `Authorization: Bearer <token>`).

### Spaces

- `GET /spaces` – list spaces. Supports filters: `city`, `type`, `minPrice`, `maxPrice`, `search`, `page`, `limit`, `sort`.
- `GET /spaces/filters` – fetch distinct cities and workspace types for filter dropdowns.
- `GET /spaces/:id` – fetch a single space by MongoDB id.
- `POST /spaces` – create a space (protected).
- `PATCH /spaces/:id` – update a space (protected).
- `DELETE /spaces/:id` – remove a space (protected).

Use the JWT returned from the auth endpoints in the `Authorization` header for protected routes.

## Folder Structure

```
backend/
├── env.example
├── package.json
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── Space.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── spaceRoutes.js
    ├── scripts/
    │   └── seedSpaces.js
    └── server.js
```

## Next Steps

- Wire the frontend login/register flows to the new auth endpoints.
- Replace the static `spaces.js` data with real responses from `GET /api/spaces`.
- Extend the API with bookings, payments, and favorites once the frontend requires them.

