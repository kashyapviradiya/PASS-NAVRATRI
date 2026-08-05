# Production Go-Live Checklist

Before driving public traffic to the site or launching your marketing campaigns, verify every item on this list.

## 1. Security & Configuration
- [ ] Vercel Environment Variables are correctly set (`JWT_SECRET` is strong and random).
- [ ] Firebase Service Account is configured in Vercel securely.
- [ ] Firestore Security Rules are applied (deny all client writes).
- [ ] Firebase Storage Rules are applied (deny all client writes).

## 2. Data Cleanliness
- [ ] All mock bookings have been deleted from Firestore (`orders` and `tickets` collections).
- [ ] Test events have been deleted or set to `draft`.
- [ ] The real Event is fully configured with correct Dates, Timings, Venue, Address, and precise Ticket Prices/Quantities.
- [ ] The live Event status is set to `published`.

## 3. Operations & Access
- [ ] Admin user accounts have been created for all required management staff.
- [ ] Scanner Staff accounts have been created and distributed for gate entry.
- [ ] You have successfully tested logging in as an Admin on the production Vercel URL.
- [ ] You have successfully tested a manual booking from the live URL to verify email/QR generation logic runs successfully in the serverless environment.

## 4. Payment Gateway (Pending)
- [ ] Razorpay API Keys (Live Mode) have been entered into the `.env` / Vercel configuration.
- [ ] The demo checkout logic has been swapped to initiate genuine Razorpay UI orders.

## 5. Performance
- [ ] The Vercel deployment shows zero build errors or TypeScript warnings.
- [ ] Custom domain DNS propagation is complete (SSL certificate issued by Vercel).
