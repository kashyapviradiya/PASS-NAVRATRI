import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyPassword, createSession, SessionPayload } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 });
    }

    let payload: SessionPayload | null = null;

    if (role === 'admin') {
      // Demo Admin Bypass (For staging ease, fallback to env vars in prod)
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@passnavratri.com';
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (email === adminEmail && password === adminPass) {
        payload = { id: 'admin-1', role: 'admin', name: 'Super Admin', email };
      }
    } else {
      // Verify Staff (Organizers have their own endpoint)
      const collectionName = role === 'scanner_staff' ? 'staff' : 'users';
      const usersSnapshot = await adminDb
        .collection(collectionName)
        .where('email', '==', email.toLowerCase())
        .where('role', '==', role)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        const user = usersSnapshot.docs[0].data();
        if (user.active !== false) { // Ensure user is active
          const isValid = await verifyPassword(password, user.passwordHash);
          if (isValid) {
            payload = {
              id: usersSnapshot.docs[0].id,
              role: user.role,
              name: user.name,
              email: user.email,
            };
          }
        }
      }
    }

    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid credentials or inactive account' }, { status: 401 });
    }

    const token = await createSession(payload);

    const response = NextResponse.json({ success: true, message: 'Logged in successfully', role: payload.role });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
