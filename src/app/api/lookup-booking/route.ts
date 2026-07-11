import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, phone } = await request.json();

    if (!bookingId || !phone) {
      return NextResponse.json({ success: false, message: 'Booking ID and Phone number are required.' }, { status: 400 });
    }

    const bookingRef = adminDb.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }

    const booking = bookingDoc.data()!;

    // Security check: Only return if phone matches
    if (booking.customerPhone !== phone) {
      return NextResponse.json({ success: false, message: 'Invalid phone number for this booking.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Lookup booking error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
