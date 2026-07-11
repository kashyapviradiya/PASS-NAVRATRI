import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use-in-prod');

export async function POST(request: NextRequest) {
  try {
    const { mobile, password } = await request.json();

    if (!mobile || !password) {
      return NextResponse.json({ success: false, message: 'Missing mobile or password' }, { status: 400 });
    }

    const staffSnapshot = await adminDb
      .collection('staff')
      .where('mobile', '==', mobile)
      .limit(1)
      .get();

    if (staffSnapshot.empty) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const staffDoc = staffSnapshot.docs[0];
    const staff = staffDoc.data();

    if (!staff.active) {
      return NextResponse.json({ success: false, message: 'Account is inactive' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, staff.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = await new SignJWT({ 
        id: staff.id, 
        name: staff.name, 
        role: staff.role, 
        assignedGates: staff.assignedGates,
        assignedEvents: staff.assignedEvents 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(JWT_SECRET);

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      success: true, 
      staff: { 
        id: staff.id, 
        name: staff.name, 
        role: staff.role, 
        assignedGates: staff.assignedGates,
        assignedEvents: staff.assignedEvents
      } 
    });

    response.cookies.set('staff_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 60 * 60 // 12 hours
    });

    return response;

  } catch (error: any) {
    console.error('Staff login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
