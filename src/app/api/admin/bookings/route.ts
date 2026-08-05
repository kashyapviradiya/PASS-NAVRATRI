import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    const paymentStatus = searchParams.get('paymentStatus');
    const bookingStatus = searchParams.get('bookingStatus');
    
    let query: FirebaseFirestore.Query = adminDb.collection('orders');

    if (eventId) {
      query = query.where('eventId', '==', eventId);
    }
    if (paymentStatus) {
      query = query.where('paymentStatus', '==', paymentStatus);
    }
    if (bookingStatus) {
      query = query.where('status', '==', bookingStatus);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
