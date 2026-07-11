import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
    }

    const ordersSnap = await adminDb.collection('orders').where('bookingId', '==', bookingId).get();
    if (ordersSnap.empty) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    const orderDoc = ordersSnap.docs[0];
    const orderData = orderDoc.data();

    // Fetch event for banner image and venue details
    const eventDoc = await adminDb.collection('events').doc(orderData.eventId).get();
    const eventData = eventDoc.data();

    // Fetch tickets
    const ticketsSnap = await adminDb.collection('tickets').where('bookingId', '==', bookingId).get();
    const tickets = ticketsSnap.docs.map(doc => doc.data());

    return NextResponse.json({
      success: true,
      booking: {
        ...orderData,
        event: eventData,
        tickets
      }
    });

  } catch (error: any) {
    console.error('Fetch booking error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
