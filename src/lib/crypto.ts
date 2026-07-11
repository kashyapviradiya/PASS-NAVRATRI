import { createHmac } from 'crypto';

/**
 * Generates a secure HMAC SHA-256 signature for a given payload string.
 * @param payload The data to sign (typically a JSON string of ticket details)
 * @returns The hex signature
 */
export function generateSignature(payload: string): string {
  const secret = process.env.QR_SIGNING_SECRET;
  if (!secret) {
    throw new Error('QR_SIGNING_SECRET is not configured in environment variables');
  }

  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return hmac.digest('hex');
}

/**
 * Verifies if the provided signature matches the payload.
 * @param payload The data to verify
 * @param signature The signature to check against
 * @returns True if the signature is valid
 */
export function verifySignature(payload: string, signature: string): boolean {
  try {
    const expectedSignature = generateSignature(payload);
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
