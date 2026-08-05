# Firebase Setup Guide

This project relies heavily on Firebase for its database, storage, and serverless infrastructure. Follow these steps to prepare your Firebase project for production.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it (e.g., `pass-navratri`).
3. Disable Google Analytics (optional, but recommended for speed unless explicitly needed).

## 2. Setup Firestore Database
1. Navigate to **Build > Firestore Database**.
2. Click **Create database**.
3. Start in **Production mode**.
4. Choose a location closest to your target audience (e.g., `asia-south1` for India).

### Firestore Security Rules
Since the application uses `firebase-admin` extensively on the server-side (Next.js API routes), the client-side security rules can be extremely restrictive.
Paste the following into your Firestore Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow public read access to active events
    match /events/{eventId} {
      allow read: if resource.data.status == 'published';
      allow write: if false; // Only Admin API can write
    }
    
    // Everything else is strictly denied on the client-side
    match /{document=**} {
      allow read, write: if false; 
    }
  }
}
```

## 3. Setup Firebase Storage
1. Navigate to **Build > Storage**.
2. Click **Get Started** and use **Production mode**.
3. Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public to read images, only admins can upload via API
    match /events/{allPaths=**} {
      allow read: if true;
      allow write: if false; 
    }
  }
}
```

## 4. Generate Admin Service Account
To allow Next.js to securely talk to Firebase:
1. Go to **Project Settings** (gear icon) > **Service Accounts**.
2. Click **Generate new private key**.
3. A JSON file will download. You will use the values inside this file to populate your environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).

*Note: In Vercel, you must enter the private key exactly as it appears in the JSON, including the `\n` characters.*
