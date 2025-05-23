# RateMyStore

RateMyStore is a web application for rating and managing stores. It features a modern frontend built with Next.js and a backend powered by Node.js and Prisma.

## Project Structure

- **frontend/**: Next.js app for the user interface, including authentication, store management, and rating features.
- **backend/**: Node.js/Express API with Prisma ORM for database management, authentication, and business logic.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL (or your preferred database, update `prisma/schema.prisma` accordingly)

### Backend Setup
1. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Set up your environment variables (see `.env.example` if available).
4. Run database migrations:
   ```powershell
   npx prisma migrate dev
   ```
5. Start the backend server:
   ```powershell
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

## Features
- User authentication (register, login, change password)
- Store listing, creation, and management
- Store rating and reviews
- Admin dashboard for managing users and stores


