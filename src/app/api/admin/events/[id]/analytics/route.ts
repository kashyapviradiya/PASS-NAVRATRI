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
    
    let validTickets = 0;
    let scannedTickets = 0;
    let cancelledTickets = 0;

    tickets.forEach((t: any) => {
      const isScanned = t.status === 'used' || t.checkedIn === true || t.isUsed === true;
      const isCancelled = t.status === 'cancelled';
      const isValid = t.status === 'valid' && !isScanned && !isCancelled;

      if (isScanned) scannedTickets++;
      else if (isCancelled) cancelledTickets++;
      else if (isValid) validTickets++;
    });

    const totalTickets = validTickets + scannedTickets + cancelledTickets;

    const checkinPercentage = (validTickets + scannedTickets) > 0 
      ? (scannedTickets / (validTickets + scannedTickets)) * 100 
      : 0;

    const scanLogsSnap = await adminDb.collection('scanLogs')
      .where('eventId', '==', id)
      .where('isDuplicateAttempt', '==', true).get();
    const duplicateScanAttempts = scanLogsSnap.docs.length;

    let totalCapacity = 0;
    let remainingTickets = 0;

    (eventData.ticketTypes || []).forEach((tt: any) => {
      totalCapacity += (tt.totalInventory || 0);
      remainingTickets += (tt.remainingQuantity || 0);
    });

    const occupancy = totalCapacity > 0 ? (totalTickets / totalCapacity) * 100 : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        totalTicketsIssued: totalTickets,
        validTickets,
        scannedTickets,
        cancelledTickets,
        checkinPercentage: checkinPercentage.toFixed(1),
        duplicateScanAttempts,
        remainingTickets,
        totalRevenue,
        checkIns: scannedTickets,
        cancellationCount: cancelledTickets,
        occupancy: Math.round(occupancy * 100) / 100,
        totalCapacity
      }
    });
  } catch (error: any) {
    console.error('Error fetching event analytics:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
