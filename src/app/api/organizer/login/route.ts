import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing email or password' }, { status: 400 });
    }

    const orgSnapshot = await adminDb
      .collection('organizers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (orgSnapshot.empty) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const orgDoc = orgSnapshot.docs[0];
    const org = orgDoc.data();

    if (!org.active) {
      return NextResponse.json({ success: false, message: 'Account is inactive' }, { status: 403 });
    }

    if (org.role !== 'organizer') {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, org.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT using existing utility
    const token = await createSession({
      id: org.id,
      role: 'organizer',
      email: org.email,
      name: org.name
    });

    const response = NextResponse.json({
      success: true,
      organizer: {
        id: org.id,
        name: org.name,
        email: org.email,
        companyName: org.companyName,
        assignedEventIds: org.assignedEventIds,
        permissions: org.permissions
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Organizer login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
