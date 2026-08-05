# Environment Variables Guide

To run this project locally or in production, you must supply the following environment variables. Do **not** commit your `.env.local` file to version control.

## Required Variables

```bash
# ==========================================
# 1. FIREBASE ADMIN CONFIGURATION
# Used by the server to read/write securely to Firestore.
# Obtain these from the Firebase Service Account JSON file.
# ==========================================
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"

# IMPORTANT: In Vercel, paste the private key exactly as it is, including \n characters.
# If running locally, you must wrap it in quotes to handle the line breaks correctly.
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...rest_of_key...\n-----END PRIVATE KEY-----\n"


# ==========================================
# 2. JWT & SECURITY
# Used for securely signing Admin, Organizer, and Staff sessions.
# Generate a random 64-character hex string for this.
# Example generator: `openssl rand -hex 32`
# ==========================================
JWT_SECRET="generate-a-strong-random-secret-here"


# ==========================================
# 3. RAZORPAY INTEGRATION (Upcoming)
# Required for processing live payments.
# ==========================================
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"


# ==========================================
# 4. APP CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL="https://www.passnavratri.com" # Change to http://localhost:3000 for local dev
```

## How to add them in Vercel
1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings > Environment Variables**.
3. Copy and paste each key-value pair.
4. Hit **Redeploy** to apply the new variables.
