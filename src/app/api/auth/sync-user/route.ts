import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const body = await request.json();
    const { uid, name, email, photoURL } = body;

    if (decodedToken.uid !== uid) {
      return NextResponse.json({ success: false, message: 'UID mismatch' }, { status: 403 });
    }

    const customerRef = adminDb.collection('customers').doc(uid);
    const customerDoc = await customerRef.get();

    const now = new Date().toISOString();

    if (!customerDoc.exists) {
      await customerRef.set({
        uid,
        name: name || '',
        email: email || '',
        photoURL: photoURL || '',
        createdAt: now,
        lastLoginAt: now,
      });
    } else {
      await customerRef.update({
        name: name || customerDoc.data()?.name || '',
        photoURL: photoURL || customerDoc.data()?.photoURL || '',
        lastLoginAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
