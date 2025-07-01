#  Hotel Booking Web Application

A full-stack hotel booking web application built with **Vue.js (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)**. This platform allows users to search for hotels by city, date, and guests, view detailed hotel information, and make bookings with dynamic pricing and user-specific features.

---

## Design Overview

### Frontend
- Developed using **Vue 3 + Vite**.
- Responsive layout optimized for mobile and desktop.
- Uses **Pinia** for state management.
- Hotel list and search components are modular and reusable.
- Hotel detail page includes amenities, guest pricing, map preview, and review visualization.

###  Backend
- Built with **Express.js**, using a RESTful API design.
- **MongoDB** used as the database with **Mongoose** schemas for hotels, users, reviews.
- Authentication system includes user registration/login with hashed passwords (bcrypt).
- Image upload support using **Multer**.
- JWT-based authentication for protected routes.

###  Deployment
- Frontend hosted on **Vercel**
- Backend deployed on **Render**
- MongoDB Atlas used for cloud-hosted database
- Environment variables configured separately for each platform



##  Data Model

## Hotel
```json
{
  "name": "String",
  "city": "String",
  "country": "String",
  "coordinates": {
    "lat": "Number",
    "lng": "Number"
  },
  "images": ["String"],
  "amenities": ["String"],
  "rating": "Number",
  "pricePerNight": "Number",
  "discountedPrice": "Number",
  "isMemberOnly": "Boolean",
  "available": ["Date"],
  "maxGuests": "Number",
  "address": "String"
}
```

## User
```
{
  "name": "String",
  "email": "String",
  "passwordHash": "String",
  "photo": "String (optional)",
  "country": "String",
  "city": "String",
}
```
## Assumptions

- Only registered users can see member-only discounted prices.
- Logged-in users receive 10% discount on applicable hotels.
- Static images and map previews are used for performance.
- During registration, users must create a strong password that includes uppercase and lowercase letters, numbers, and at least one special character to ensure security.

## Problems Encountered

- Render cold starts caused 502 errors until UptimeRobot was integrated to keep the backend alive.
- Mobile dark mode caused black background and form elements, which were fixed by forcing light mode with `color-scheme` and global CSS resets.
- CORS issues between Vercel and Render were resolved with proper middleware and environment setup.
- Ensuring responsive behavior on smaller screens required adjustments in layout and card scaling.
- File uploads had to be carefully handled and served statically in the backend for access from frontend.

