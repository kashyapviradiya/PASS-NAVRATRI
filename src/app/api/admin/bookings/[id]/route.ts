import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Fetch Order
    const orderDoc = await adminDb.collection('orders').doc(id).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    const orderData = { id: orderDoc.id, ...orderDoc.data() };

    // Fetch related tickets
    const ticketsSnapshot = await adminDb.collection('tickets').where('bookingId', '==', id).get();
    const tickets = ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ 
      success: true, 
      booking: orderData,
      tickets 
    });
  } catch (error: any) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
