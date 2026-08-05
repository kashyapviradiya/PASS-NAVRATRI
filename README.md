# PASS NAVRATRI - Event Management Platform

A modern, high-performance web application designed specifically for managing Navratri events, ticketing, and QR-based gate check-ins. Built with Next.js 14, TailwindCSS, and Firebase.

## Key Features
- **Public Event Portal:** Beautiful, responsive UI for customers to view events and purchase tickets.
- **Admin Dashboard:** Comprehensive dashboard for managing events, manual bookings, viewing analytics, and audit logs.
- **QR Ticket Generation:** Cryptographically secure QR codes generated for every ticket upon successful payment.
- **Gate Scanner App:** A dedicated portal for event staff to scan QR codes and mark tickets as 'Checked In'.
- **Role-based Access:** Distinct panels for Admins, Organizers, and Scanner Staff.

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS + Lucide Icons
- **Database:** Firebase Firestore
- **Authentication:** Custom JWT / Firebase Auth
- **Storage:** Firebase Cloud Storage

## Local Development Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables:**
   Create a `.env.local` file in the root directory. Refer to `ENV_VARS.md` for the required keys.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Access the application:**
   - Public site: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`
   - Staff Scanner: `http://localhost:3000/staff`

## Architecture Overview
- **Orders & Tickets:** When a booking is made, a single `Order` document is created containing the billing info. Simultaneously, individual `Ticket` documents are generated per pass purchased, each containing a unique `qrValue`.
- **Atomic Operations:** Cancellations and manual bookings use Firestore Batch Writes (`adminDb.batch()`) to ensure inventory counts always stay perfectly in sync.

---
*For production deployment, see `DEPLOYMENT.md`.*
