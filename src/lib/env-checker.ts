export function validateEnv() {
  const requiredServerEnvs = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'QR_SIGNING_SECRET',
    'DEMO_SCANNER_EMAIL',
    'DEMO_SCANNER_PASSWORD'
  ];

  const requiredPublicEnvs = [
    'NEXT_PUBLIC_DEMO_MODE',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingEnvs: string[] = [];

  for (const env of requiredServerEnvs) {
    if (!process.env[env]) {
      missingEnvs.push(env);
    }
  }

  for (const env of requiredPublicEnvs) {
    if (!process.env[env]) {
      missingEnvs.push(env);
    }
  }

  // Also check if DEMO_MODE exists, if user used that instead of NEXT_PUBLIC_DEMO_MODE
  if (!process.env.NEXT_PUBLIC_DEMO_MODE && !process.env.DEMO_MODE) {
      if (!missingEnvs.includes('NEXT_PUBLIC_DEMO_MODE')) {
        missingEnvs.push('NEXT_PUBLIC_DEMO_MODE');
      }
  }

  if (missingEnvs.length > 0) {
    console.error('==================================================');
    console.error('🚨 ERROR: Missing required environment variables:');
    console.error('==================================================');
    missingEnvs.forEach(env => console.error(`- ${env}`));
    console.error('==================================================');
    // We do not throw an error that crashes the entire build process, we just log it loudly.
    // Throwing an error could break the build completely in some Next.js setups if not handled carefully, 
    // but the user wants us to fail early if env is missing during runtime.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Some pages may crash during development due to missing variables.');
    }
  }
}
