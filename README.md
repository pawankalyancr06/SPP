# SportifyPro

A comprehensive sports venue booking platform.

## Project Structure

```
SportifyPro/
├── client/          # React frontend application
├── server/          # Node.js/Express backend application
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

#### Client Setup

```bash
cd client
npm install
npm run dev
```

#### Server Setup

```bash
cd server
npm install
npm run dev
```

### Environment Variables

#### Client (.env)
- `REACT_APP_API_URL` - Backend API URL

#### Server (.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

## Features

- User authentication and authorization
- Venue listing and management
- Booking system
- Payment integration (Razorpay)
- QR code generation for bookings
- Role-based access control (User, Owner, Admin)

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Razorpay
- QRCode

