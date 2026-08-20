import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
    }

    // The ID could be the document ID, 'id' field, or 'bookingId' field depending on demo vs real flow
    let orderDoc: any = null;
    
    const docRef = await adminDb.collection('orders').doc(bookingId).get();
    if (docRef.exists) {
      orderDoc = docRef;
    } else {
      const byIdSnap = await adminDb.collection('orders').where('id', '==', bookingId).get();
      if (!byIdSnap.empty) {
        orderDoc = byIdSnap.docs[0];
      } else {
        const byBookingIdSnap = await adminDb.collection('orders').where('bookingId', '==', bookingId).get();
        if (!byBookingIdSnap.empty) {
          orderDoc = byBookingIdSnap.docs[0];
        }
      }
    }

    if (!orderDoc) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    const orderData = orderDoc.data()!;

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
