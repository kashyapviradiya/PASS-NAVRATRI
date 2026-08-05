import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const eventDoc = await adminDb.collection('events').doc(id).get();
    if (!eventDoc.exists) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    const eventData = eventDoc.data()!;

    // Fetch orders and tickets for this event
    const ordersSnap = await adminDb.collection('orders').where('eventId', '==', id).get();
    const ticketsSnap = await adminDb.collection('tickets').where('eventId', '==', id).get();

    let totalRevenue = 0;
    let cancellationCount = 0;
    
    ordersSnap.docs.forEach(doc => {
      const order = doc.data();
      if (order.status === 'cancelled') {
        cancellationCount++;
      } else if (order.paymentStatus === 'paid' || order.status === 'confirmed') {
        totalRevenue += (order.amount || order.grandTotal || 0);
      }
    });

    const tickets = ticketsSnap.docs.map(d => d.data());
    const ticketsSold = tickets.filter(t => t.status !== 'cancelled').length;
    const checkIns = tickets.filter(t => t.status === 'used' || t.checkedIn).length;

    let totalCapacity = 0;
    let remainingTickets = 0;

    (eventData.ticketTypes || []).forEach((tt: any) => {
      totalCapacity += (tt.totalInventory || 0);
      remainingTickets += (tt.remainingQuantity || 0);
    });

    const occupancy = totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        ticketsSold,
        remainingTickets,
        totalRevenue,
        checkIns,
        cancellationCount,
        occupancy: Math.round(occupancy * 100) / 100,
        totalCapacity
      }
    });
  } catch (error: any) {
    console.error('Error fetching event analytics:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
