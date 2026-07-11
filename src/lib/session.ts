import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_super_secure_jwt_secret_for_demo';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  role: 'admin' | 'organizer' | 'scanner_staff' | 'customer';
  email?: string;
  name?: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const jwt = await new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedSecret);
  return jwt;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, encodedSecret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
