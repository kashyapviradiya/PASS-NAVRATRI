# System Maintenance & Operations Guide

This guide covers routine operational procedures for managing the PASS NAVRATRI system in a production environment.

## 1. Creating Admin Users
Currently, there is no UI to create new root Admins. This must be done manually in Firebase to ensure security.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Authentication**.
3. Click **Add User** and enter the email and a secure password.
4. Copy the newly generated **User UID**.
5. Navigate to **Firestore Database**.
6. Find the `users` collection.
7. Create a new document where the **Document ID** is exactly the **User UID** you copied.
8. Add the following fields to the document:
   - `email` (string): The user's email
   - `role` (string): exactly `admin`
   - `createdAt` (string): e.g., `2026-08-05T12:00:00Z`

The user can now log in at `/admin/login` and they will have full root access.

## 2. Backup & Restore (Firestore)
Google Cloud allows you to schedule automated backups of your Firestore data, which is highly recommended for a production ticketing system.

**Manual Export:**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) (ensure you are logged into the same Google account as your Firebase project).
2. Navigate to **Firestore > Import/Export**.
3. Click **Export**.
4. Select all collections (`events`, `orders`, `tickets`, `users`, `admin_logs`).
5. Choose a Cloud Storage bucket to save the backup.

**Restore:**
1. In the same menu, click **Import**.
2. Select the Cloud Storage bucket containing your backup timestamp.
3. Import the data. *(Note: Importing over existing documents overwrites them; it does not delete documents created after the backup).*

## 3. Resolving Inventory Desyncs
If for any reason (e.g., a network crash mid-transaction) the `soldQuantity` on an event does not match the actual number of valid tickets issued, you can manually resync this:
1. Temporarily mark the event as `draft` in the Admin Hub so no new bookings occur.
2. Export the bookings table to CSV from the Admin Bookings page.
3. Manually sum the tickets sold, and update the specific `event` document in Firestore directly.
4. Mark the event as `published` again.

## 4. Resetting Demo Data
Before launching your live marketing campaign, ensure you have deleted all dummy/mock bookings:
1. Go to Firebase Firestore.
2. Delete any documents in `orders` where `demo == true` (if visible) or delete the dummy orders manually.
3. Ensure you delete the respective dummy `tickets` associated with those orders.
4. Reset the `totalTicketsSold` and `totalRevenue` counters on your live event back to `0`.
