import * as admin from 'firebase-admin';

import { validateEnv } from './env-checker';

// Validate environment on server startup
validateEnv();

// Protect against multiple initializations in development mode
let isInitialized = false;

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // Handle newline characters in private key when loaded from environment variable
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      isInitialized = true;
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('⚠️ Firebase Admin environment variables are missing (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). Admin features will not work.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
} else {
  isInitialized = true;
}

// Create a safe proxy that throws a clear error if used without initialization
const createSafeService = <T>(serviceFactory: () => T, serviceName: string): T => {
  return new Proxy({} as T, {
    get(target, prop) {
      if (!isInitialized) {
        throw new Error(`FIREBASE_NOT_CONFIGURED: Missing Firebase environment variables. Cannot use ${serviceName}.`);
      }
      const service = serviceFactory();
      const value = (service as any)[prop];
      if (typeof value === 'function') {
        return value.bind(service);
      }
      return value;
    }
  });
};

export const adminDb = createSafeService(() => admin.firestore(), 'Firestore');
export const adminAuth = createSafeService(() => admin.auth(), 'Auth');
export const adminStorage = createSafeService(() => admin.storage(), 'Storage');
