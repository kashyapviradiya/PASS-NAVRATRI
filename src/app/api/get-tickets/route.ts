import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get('mobile');
    const bookingId = searchParams.get('bookingId');
    const customerUid = searchParams.get('customerUid');

    if (!mobile && !bookingId && !customerUid) {
      return NextResponse.json({ success: false, message: 'Missing search parameter' }, { status: 400 });
    }

    if (customerUid) {
      // Secure route: Must have valid token matching customerUid
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        if (decodedToken.uid !== customerUid) {
          return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }
      } catch (e) {
        return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 });
      }
    }

    let query: any = adminDb.collection('tickets');
    if (customerUid) {
      query = query.where('customerUid', '==', customerUid);
    } else if (bookingId) {
      query = query.where('bookingId', '==', bookingId);
    } else if (mobile) {
      query = query.where('mobile', '==', mobile);
    }

    const ticketsSnapshot = await query.get();

    if (ticketsSnapshot.empty) {
      return NextResponse.json({ success: true, tickets: [] });
    }

    const tickets = ticketsSnapshot.docs.map(doc => doc.data());
    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
