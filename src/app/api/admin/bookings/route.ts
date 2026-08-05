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
    
    // Fetch all tickets to aggregate stats per booking
    const ticketsSnapshot = await adminDb.collection('tickets').get();
    const ticketsByBookingId: Record<string, any[]> = {};
    
    ticketsSnapshot.docs.forEach(doc => {
      const t = doc.data();
      // ticket.bookingId might be the order.id or order.bookingId. Usually t.bookingId === order.id
      const bId = t.bookingId || t.orderId;
      if (bId) {
        if (!ticketsByBookingId[bId]) ticketsByBookingId[bId] = [];
        ticketsByBookingId[bId].push(t);
      }
    });

    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      const bId = doc.id;
      const orderBookingId = data.bookingId;
      
      const orderTickets = ticketsByBookingId[bId] || ticketsByBookingId[orderBookingId] || [];
      
      let valid = 0;
      let scanned = 0;
      let cancelled = 0;
      
      orderTickets.forEach(t => {
        const isScanned = t.status === 'used' || t.checkedIn === true || t.isUsed === true;
        const isCancelled = t.status === 'cancelled';
        const isValid = t.status === 'valid' && !isScanned && !isCancelled;
        
        if (isScanned) scanned++;
        else if (isCancelled) cancelled++;
        else if (isValid) valid++;
      });

      return {
        id: doc.id,
        ...data,
        stats: {
          total: orderTickets.length,
          valid,
          scanned,
          cancelled
        }
      };
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
