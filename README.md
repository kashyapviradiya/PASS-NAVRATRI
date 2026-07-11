# PASS NAVRATRI - Premium Event Booking Platform

Pass Navratri is an ultra-premium, full-stack Next.js event booking and ticketing platform tailored for Navratri events. It features a luxury aesthetic, secure payment processing, cryptographically secure QR ticket generation, and a complete admin/staff suite.

## Features

- **Luxury Aesthetic**: High-end UI with `framer-motion` animations, glassmorphism, and a rich Navratri color palette.
- **End-to-End Booking**: Complete checkout flow from event selection to final QR ticket.
- **Razorpay Integration**: Server-side verified secure payments.
- **Firebase Backend**: Real-time Firestore database for events, bookings, and inventory.
- **Inventory Management**: Atomic Firestore transactions to prevent double-booking.
- **Secure Tickets**: Cryptographically secure QR tokens verifiable only by authorized staff.
- **Staff Access Control**: Private `/staff/scanner` route with built-in camera scanning.
- **Admin Dashboard**: Real-time analytics, revenue tracking, and event management.
- **My Tickets Portal**: Phone number + Booking ID lookup for instant access to purchased passes.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Lucide React
- **Animations**: Framer Motion
- **Database/Auth**: Firebase Admin SDK & Client SDK
- **Payments**: Razorpay Node SDK
- **QR Codes**: `qrcode` (Generation) & `html5-qrcode` (Scanning)

## Local Development Setup

### 1. Install Dependencies
Make sure you are running Node.js 18+.
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and populate it:
```bash
cp .env.example .env.local
```

**Required Keys**:
- **Firebase Client**: Get from your Firebase Console (Project Settings > General > Web App).
- **Firebase Admin**: Get from Firebase Console (Project Settings > Service Accounts > Generate new private key).
- **Razorpay**: Get test keys from your Razorpay Dashboard.

*Note: If `DEMO_MODE=true` is set, the application will attempt to function even if Razorpay or Firebase keys are missing by mocking the APIs.*

### 3. Database Seeding (Demo Mode Only)
If you want to populate the Firestore database with beautiful premium placeholder data, ensure `DEMO_MODE=true` in your `.env.local` and run this API route manually via Postman or Curl:
```bash
curl -X POST http://localhost:3000/api/seed -H "Authorization: Bearer seed_secret_123"
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Architecture

- **Public Routes**: `/`, `/#events`, `/checkout/[id]`, `/ticket/[id]`, `/my-tickets`
- **Protected Routes**: 
  - `/admin/*`: Admin dashboard and management. Requires `admin` role.
  - `/staff/*`: QR Scanner for venue entry. Requires `scanner_staff` role.
- **API Routes**: Secure backend logic for `create-order`, `verify-payment`, `verify-ticket`, `mark-entry`, and webhooks.

## Payment Flow
1. Frontend calls `/api/create-order` to generate a Razorpay Order ID.
2. Razorpay Checkout modal opens.
3. On success, frontend sends payment details to `/api/verify-payment`.
4. Backend verifies HMAC signature.
5. Backend uses a **Firestore Transaction** to safely decrement ticket inventory and prevent race conditions.
6. Backend generates unique Tickets with secure crypto-tokens.
7. Frontend redirects to the confirmed ticket page.

## Deployment
1. Push your code to GitHub.
2. Import project in Vercel.
3. Add all environment variables from `.env.local` into the Vercel dashboard.
4. Note: Ensure `FIREBASE_PRIVATE_KEY` handles newlines correctly (wrap in quotes if needed).
5. Deploy!

## Going Live
To move from Test Mode to Live Mode:
1. Set `DEMO_MODE=false`.
2. Replace `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` with Live credentials.
3. Update your Razorpay Webhook URL to point to your production Vercel domain (`https://yourdomain.com/api/webhook/razorpay`).
